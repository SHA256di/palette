import { NextRequest, NextResponse } from 'next/server'
import { searchTumblrByTag, getBestTumblrImageUrl, processImageForTransparency } from '@/lib/tumblr'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 12, removeBackground = false } = await request.json()

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 })
    }

    const posts = await searchTumblrByTag(vibe, limit)
    
    // Process Tumblr posts into image format
    const processedImages = await Promise.all(
      posts.map(async (post) => {
        const photo = post.photos?.[0]
        if (!photo) return null

        const imageUrl = getBestTumblrImageUrl(photo, 'medium')
        const smallUrl = getBestTumblrImageUrl(photo, 'small')
        const processedUrl = removeBackground 
          ? await processImageForTransparency(imageUrl)
          : imageUrl

        return {
          id: post.id,
          url: processedUrl,
          originalUrl: imageUrl,
          smallUrl: smallUrl,
          thumbUrl: smallUrl,
          alt: photo.caption || `${vibe} aesthetic from Tumblr`,
          blogger: {
            name: post.blog_name,
            url: post.post_url
          },
          tags: post.tags,
          timestamp: post.timestamp,
          width: photo.original_size?.width || 0,
          height: photo.original_size?.height || 0,
          processed: removeBackground,
          source: 'tumblr'
        }
      })
    )

    // Filter out null results
    const validImages = processedImages.filter(img => img !== null)

    return NextResponse.json({ 
      images: validImages,
      vibe,
      total: validImages.length,
      backgroundRemoved: removeBackground,
      source: 'tumblr'
    })
  } catch (error) {
    console.error('Error generating aesthetic images from Tumblr:', error)
    return NextResponse.json(
      { error: 'Failed to generate aesthetic images from Tumblr' },
      { status: 500 }
    )
  }
}