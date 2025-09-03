import { NextRequest, NextResponse } from 'next/server'
import { analyzeImageWithCLIP, aestheticTagsToTumblrTags } from '@/lib/clip'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Please upload an image smaller than 10MB.' },
        { status: 400 }
      )
    }

    console.log(`🖼️ Analyzing image: ${file.name} (${file.size} bytes)`)

    // Analyze image with CLIP
    const clipAnalysis = await analyzeImageWithCLIP(file)
    
    // Convert to Tumblr search tags
    const tumblrTags = aestheticTagsToTumblrTags(clipAnalysis.aestheticTags)

    console.log(`✨ CLIP tags: ${clipAnalysis.aestheticTags.join(', ')}`)
    console.log(`🏷️ Tumblr tags: ${tumblrTags.join(', ')}`)

    return NextResponse.json({
      success: true,
      analysis: {
        aestheticTags: clipAnalysis.aestheticTags,
        confidence: clipAnalysis.confidence,
        description: clipAnalysis.description,
        detectedAesthetics: clipAnalysis.detectedAesthetics,
        apiTags: clipAnalysis.apiTags,
        tumblrTags: tumblrTags
      }
    })

  } catch (error) {
    console.error('Image analysis error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}