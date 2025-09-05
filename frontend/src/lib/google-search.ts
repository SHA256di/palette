// src/lib/google-search.ts

// ✅ Match Google Custom Search API schema
interface GoogleSearchResult {
  link: string   // direct URL to the image
  title: string
  snippet: string
  image?: {
    contextLink: string
    height: number
    width: number
    byteSize: number
    thumbnailLink: string
    thumbnailHeight: number
    thumbnailWidth: number
  }
}

interface GoogleSearchResponse {
  items?: GoogleSearchResult[]
  error?: {
    message: string
  }
}

export interface MoodboardImage {
  id: string
  url: string
  originalUrl: string
  smallUrl: string
  thumbUrl: string
  alt: string
  width: number
  height: number
  source: string
  timestamp: number
}

export async function searchGoogleImages(
  keywords: string[],
  limit: number = 12
): Promise<MoodboardImage[]> {
  const API_KEY = process.env.GOOGLE_SEARCH_API_KEY
  const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!API_KEY || !SEARCH_ENGINE_ID) {
    throw new Error('❌ Missing Google Search API configuration')
  }

  try {
    const images: MoodboardImage[] = []
    const usedUrls = new Set<string>()

    // 🔄 Search each keyword until limit is reached
    for (const keyword of keywords) {
      if (images.length >= limit) break

      const searchUrl = new URL('https://www.googleapis.com/customsearch/v1')
      searchUrl.searchParams.set('key', API_KEY)
      searchUrl.searchParams.set('cx', SEARCH_ENGINE_ID)
      searchUrl.searchParams.set('q', keyword)
      searchUrl.searchParams.set('searchType', 'image')
      searchUrl.searchParams.set('imgSize', 'medium')
      searchUrl.searchParams.set('imgType', 'photo')
      searchUrl.searchParams.set('safe', 'active')
      searchUrl.searchParams.set('num', '10')

      console.log(`🔍 Searching Google Images for: "${keyword}"`)

      const response = await fetch(searchUrl.toString())
      const data: GoogleSearchResponse = await response.json()

      if (data.error) {
        console.error(`❌ Google Search API error for "${keyword}":`, data.error.message)
        continue
      }

      if (!data.items || data.items.length === 0) {
        console.log(`⚠️ No results found for "${keyword}"`)
        continue
      }

      // ✅ Process results and add unique images
      for (const item of data.items) {
        if (images.length >= limit) break
        if (!item.link || usedUrls.has(item.link)) continue

        if (item.image) {
          usedUrls.add(item.link)
          images.push({
            id: `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: item.link,
            originalUrl: item.link,
            smallUrl: item.image.thumbnailLink,
            thumbUrl: item.image.thumbnailLink,
            alt: item.title || keyword,
            width: item.image.width || 400,
            height: item.image.height || 400, // default square if missing
            source: 'google-images',
            timestamp: Date.now()
          })
        }
      }

      console.log(`📸 Found ${images.length} total images so far`)
    }

    console.log(`✅ Final unique images collected: ${images.length}`)
    return images.slice(0, limit)

  } catch (error) {
    console.error('❌ Google Search error:', error)
    throw new Error('Failed to search Google Images')
  }
}

export function validateImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const pathname = parsedUrl.pathname.toLowerCase()
    
    return (
      validExtensions.some(ext => pathname.endsWith(ext)) ||
      parsedUrl.searchParams.has('format') ||
      url.includes('googleusercontent.com')
    )
  } catch {
    return false
  }
}
