import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithGemini, imageToBase64 } from '@/lib/gemini'
import { searchGoogleImages, type MoodboardImage } from '@/lib/google-search'
import { getAestheticById } from '@/lib/aesthetics'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const selectedAesthetic = formData.get('aesthetic') as string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      )
    }

    console.log(`🖼️ Analyzing image: ${image.name} (${image.size} bytes)`)
    console.log(`🎨 Selected aesthetic: ${selectedAesthetic || 'auto-detect'}`)

    // Convert image to base64 for Gemini
    const { base64, mimeType } = await imageToBase64(image)

    // Analyze with Gemini Vision
    console.log('🤖 Calling Gemini Vision API...')
    const analysis = await analyzeImageWithGemini(base64, mimeType)

    console.log('📊 Gemini analysis result:', analysis)

    // Use selected aesthetic or fallback to Gemini's detection
    let finalAesthetics = analysis.aesthetics
    if (selectedAesthetic && selectedAesthetic !== 'auto') {
      finalAesthetics = [selectedAesthetic]
      console.log(`🎯 Using user-selected aesthetic: ${selectedAesthetic}`)
    }

    // Get aesthetic details
    const aestheticData = finalAesthetics.map(id => getAestheticById(id)).filter(Boolean)
    
    // Combine keywords from Gemini + aesthetic definitions
    const allKeywords = [
      ...analysis.keywords,
      ...(aestheticData[0]?.keywords || [])
    ]

    // Remove duplicates and limit keywords
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 12)
    console.log('🔍 Search keywords:', uniqueKeywords)

    // Search Google Images
    console.log('📸 Searching Google Images...')
    const images = await searchGoogleImages(uniqueKeywords, 12)

    // Create uploaded product image entry
    const uploadedImageUrl = `data:${mimeType};base64,${base64}`
    const productImage: MoodboardImage = {
      id: 'uploaded-product',
      url: uploadedImageUrl,
      originalUrl: uploadedImageUrl,
      smallUrl: uploadedImageUrl,
      thumbUrl: uploadedImageUrl,
      alt: 'Uploaded product',
      width: 400,
      height: 600,
      source: 'upload',
      timestamp: Date.now()
    }

    // Combine product image with searched images
    const allImages = [productImage, ...images]

    const response = {
      success: true,
      analysis: {
        detectedAesthetics: analysis.aesthetics,
        selectedAesthetic: finalAesthetics[0] || analysis.aesthetics[0],
        keywords: uniqueKeywords,
        aestheticData: aestheticData[0]
      },
      images: allImages,
      total: allImages.length,
      source: 'gemini-google-search'
    }

    console.log(`✅ Analysis complete: ${allImages.length} total images`)
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Analyze image error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}