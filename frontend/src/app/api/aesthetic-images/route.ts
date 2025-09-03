import { NextRequest, NextResponse } from 'next/server'
import { searchTumblrByTag, searchTumblrByTaggedEndpoint, getBestTumblrImageUrl, processImageForTransparency } from '@/lib/tumblr'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 12, removeBackground = false, apiTags } = await request.json()

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 })
    }

    console.log(`📱 Aesthetic images API called for vibe: ${vibe}`, apiTags ? 'with enhanced mapping' : 'with legacy mapping')

    // Get Tumblr posts using enhanced aesthetic analysis if available
    const posts = await searchTumblrByTaggedEndpoint(vibe, limit, apiTags)
    
    // Process Tumblr posts into images and quotes
    const processedItems = await Promise.all(
      posts.map(async (post) => {
        // Handle photo posts
        if (post.photos?.[0]) {
          const photo = post.photos[0]
          const imageUrl = getBestTumblrImageUrl(photo, 'medium')
          const smallUrl = getBestTumblrImageUrl(photo, 'small')
          const processedUrl = removeBackground 
            ? await processImageForTransparency(imageUrl)
            : imageUrl

          return {
            type: 'image',
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
        }
        
        // Handle text posts with quotes
        if (post.type === 'text' && post.body) {
          // Extract clean text content (remove HTML tags)
          const cleanText = post.body.replace(/<[^>]*>/g, '').trim()
          
          // Only include posts that look like quotes (short, meaningful text)
          if (cleanText.length > 10 && cleanText.length < 300 && 
              (cleanText.includes('"') || cleanText.includes("'") || 
               cleanText.match(/^[A-Z].*[.!?]$/))) {
            
            return {
              type: 'quote',
              id: post.id,
              text: cleanText,
              title: post.title || null,
              blogger: {
                name: post.blog_name,
                url: post.post_url
              },
              tags: post.tags,
              timestamp: post.timestamp,
              source: 'tumblr'
            }
          }
        }
        
        return null
      })
    )

    // Filter out null results and separate by type
    const validItems = processedItems.filter(item => item !== null)
    const images = validItems.filter(item => item.type === 'image')
    const quotes = validItems.filter(item => item.type === 'quote')

    console.log(`📝 Found ${quotes.length} quotes and ${images.length} images for ${vibe}`)

    return NextResponse.json({ 
      images: images,
      quotes: quotes,
      vibe,
      total: validItems.length,
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