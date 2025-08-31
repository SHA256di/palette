const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const UNSPLASH_API_BASE = 'https://api.unsplash.com'

interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  width: number
  height: number
  color: string
  tags?: Array<{
    title: string
  }>
}

interface UnsplashSearchResponse {
  total: number
  total_pages: number
  results: UnsplashImage[]
}

// Enhanced vibe to Unsplash search terms mapping
export function mapVibeToUnsplashTerms(vibe: string): string[] {
  const vibeToTermsMap: Record<string, string[]> = {
    'girlblogger': ['indie aesthetic', 'tumblr girl', 'vintage camera', 'coffee shop', 'books aesthetic', 'minimal room'],
    'indie sleaze': ['party aesthetic', 'flash photography', 'concert', 'urban nightlife', 'vintage club', 'neon lights'],
    'pink pilates princess': ['pink aesthetic', 'workout', 'activewear', 'healthy lifestyle', 'smoothie', 'pilates studio'],
    'coastal grandmother': ['coastal living', 'linen', 'natural light', 'beach house', 'organic', 'minimalist home'],
    'dark academia': ['library', 'vintage books', 'candles', 'classical architecture', 'study aesthetic', 'gothic'],
    'cyberpunk': ['neon', 'futuristic', 'technology', 'cyberpunk', 'synthwave', 'digital art'],
    'cottagecore': ['cottage', 'flowers', 'countryside', 'vintage kitchen', 'garden', 'rustic'],
    'y2k': ['2000s aesthetic', 'retro technology', 'holographic', 'metallic', 'cyber', 'futuristic fashion'],
    'dreamy': ['soft lighting', 'dreamy', 'ethereal', 'pastel', 'clouds', 'fantasy'],
    'moody': ['dark mood', 'moody lighting', 'shadows', 'atmospheric', 'noir', 'dramatic'],
    'vintage': ['vintage', 'retro', 'antique', 'old photographs', 'film photography', 'nostalgia'],
    'grunge': ['grunge', '90s aesthetic', 'alternative', 'street style', 'urban decay', 'punk'],
    'romantic': ['romantic', 'flowers', 'soft light', 'candles', 'vintage lace', 'love'],
    'pastel': ['pastel colors', 'soft aesthetic', 'kawaii', 'cute', 'candy colors', 'sweet'],
    'aesthetic': ['aesthetic', 'minimalist', 'clean', 'modern', 'trendy', 'instagram'],
    'punk': ['punk rock', 'alternative fashion', 'leather jacket', 'band', 'rebellion', 'edgy'],
    'boho': ['bohemian', 'boho chic', 'macrame', 'plants', 'crystals', 'free spirit'],
    'glam': ['glamorous', 'luxury', 'gold', 'glitter', 'fashion', 'elegant'],
    'urban': ['city life', 'street photography', 'urban', 'modern architecture', 'streetwear', 'metropolitan'],
    'futuristic': ['futuristic', 'sci-fi', 'technology', 'minimalist design', 'clean lines', 'modern'],
    'noir': ['film noir', 'black and white', 'dramatic lighting', 'vintage detective', 'shadows', 'mystery']
  }

  const defaultTerms = ['aesthetic', 'minimalist', 'trendy', 'modern', 'artistic']

  const lowerVibe = vibe.toLowerCase()
  
  // Find matching vibe or use default
  for (const [key, terms] of Object.entries(vibeToTermsMap)) {
    if (lowerVibe.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerVibe)) {
      return terms
    }
  }

  return defaultTerms
}

// Search Unsplash for images based on vibe
export async function searchUnsplashImages(vibe: string, limit: number = 12): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('Unsplash API key not found')
    return []
  }

  const searchTerms = mapVibeToUnsplashTerms(vibe)
  const allImages: UnsplashImage[] = []

  try {
    // Search with multiple terms to get variety
    for (const term of searchTerms.slice(0, 3)) { // Use first 3 search terms
      const response = await fetch(
        `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(term)}&per_page=${Math.ceil(limit / 3)}&orientation=portrait&order_by=relevant`,
        {
          headers: {
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Unsplash API request failed: ${response.status}`)
      }

      const data: UnsplashSearchResponse = await response.json()
      allImages.push(...data.results)

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Deduplicate and filter for quality
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(img => img.id === image.id)
    )

    // Filter for better quality images
    const qualityImages = uniqueImages.filter(image => {
      // Filter out very small images
      if (image.width < 400 || image.height < 400) return false
      
      // Prefer images with good aspect ratios for moodboards
      const aspectRatio = image.width / image.height
      if (aspectRatio < 0.3 || aspectRatio > 3) return false
      
      return true
    })

    return qualityImages.slice(0, limit)
  } catch (error) {
    console.error('Error searching Unsplash images:', error)
    return []
  }
}

// Get curated collection for a specific vibe
export async function getCuratedImagesForVibe(vibe: string, limit: number = 8): Promise<UnsplashImage[]> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error('Unsplash API key not found')
    return []
  }

  try {
    // For aesthetic vibes, we can also search curated collections
    const searchQuery = `${vibe} aesthetic collection`
    
    const response = await fetch(
      `${UNSPLASH_API_BASE}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=${limit}&orientation=square&order_by=popular`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Unsplash curated search failed: ${response.status}`)
    }

    const data: UnsplashSearchResponse = await response.json()
    return data.results
  } catch (error) {
    console.error('Error getting curated Unsplash images:', error)
    return []
  }
}

// Process image for background removal using Remove.bg API
export async function processImageForTransparency(imageUrl: string): Promise<string> {
  const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY
  
  if (!REMOVE_BG_API_KEY) {
    console.log('Remove.bg API key not found, returning original image')
    return imageUrl
  }

  try {
    // Download the image first
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image')
    }
    
    const imageBlob = await imageResponse.blob()
    
    // Create form data for Remove.bg API
    const formData = new FormData()
    formData.append('image_file', imageBlob)
    formData.append('size', 'auto')
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Remove.bg API failed: ${response.status}`)
    }

    // Convert response to blob and create object URL
    const resultBlob = await response.blob()
    const processedUrl = URL.createObjectURL(resultBlob)
    
    console.log('Background removed successfully for:', imageUrl)
    return processedUrl
  } catch (error) {
    console.error('Background removal failed:', error)
    // Fallback to original image if background removal fails
    return imageUrl
  }
}

// Client-side background removal (browser-based alternative)
export async function processImageForTransparencyClient(imageUrl: string): Promise<string> {
  try {
    // This would use @imgly/background-removal or similar browser-based solution
    // For now, we'll implement this as a future enhancement
    console.log('Client-side background removal (future feature):', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('Client-side background removal failed:', error)
    return imageUrl
  }
}