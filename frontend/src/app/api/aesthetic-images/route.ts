import { NextRequest, NextResponse } from 'next/server'
import { searchUnsplashImages, processImageForTransparency } from '@/lib/unsplash'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 12, removeBackground = false } = await request.json()

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 })
    }

    const images = await searchUnsplashImages(vibe, limit)
    
    // Process images for background removal if requested
    const processedImages = await Promise.all(
      images.map(async (image) => {
        const processedUrl = removeBackground 
          ? await processImageForTransparency(image.urls.regular)
          : image.urls.regular

        return {
          id: image.id,
          url: processedUrl,
          originalUrl: image.urls.regular,
          smallUrl: image.urls.small,
          thumbUrl: image.urls.thumb,
          alt: image.alt_description || image.description || 'Aesthetic image',
          photographer: {
            name: image.user.name,
            username: image.user.username
          },
          width: image.width,
          height: image.height,
          color: image.color,
          processed: removeBackground
        }
      })
    )

    return NextResponse.json({ 
      images: processedImages,
      vibe,
      total: processedImages.length,
      backgroundRemoved: removeBackground
    })
  } catch (error) {
    console.error('Error generating aesthetic images:', error)
    return NextResponse.json(
      { error: 'Failed to generate aesthetic images' },
      { status: 500 }
    )
  }
}