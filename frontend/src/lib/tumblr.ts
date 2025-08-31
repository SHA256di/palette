const TUMBLR_API_KEY = process.env.TUMBLR_API_KEY
const TUMBLR_API_BASE = 'https://api.tumblr.com/v2'

interface TumblrPhoto {
  caption: string
  alt_sizes: Array<{
    url: string
    width: number
    height: number
  }>
  original_size: {
    url: string
    width: number
    height: number
  }
}

interface TumblrPost {
  id: string
  blog_name: string
  post_url: string
  type: string
  timestamp: number
  tags: string[]
  photos?: TumblrPhoto[]
  caption?: string
  summary?: string
}

interface TumblrResponse {
  response: {
    posts: TumblrPost[]
    total_posts?: number
  }
}

// Enhanced vibe to Tumblr tag mapping for authentic aesthetic content
export function mapVibeToTumblrTags(vibe: string): string[] {
  const vibeToTagsMap: Record<string, string[]> = {
    'girlblogger': ['girlblogger', 'coquette', 'soft girl', 'tumblr girl', 'indie girl', 'bookish'],
    'indie sleaze': ['indie sleaze', 'hipster', 'vintage party', 'flash photography', 'cigarettes', 'dirty glamour'],
    'pink pilates princess': ['pilates princess', 'clean girl', 'that girl', 'wellness', 'pink aesthetic', 'workout'],
    'coastal grandmother': ['coastal grandmother', 'linen', 'minimalist', 'neutral', 'coastal', 'hygge'],
    'dark academia': ['dark academia', 'light academia', 'books', 'vintage', 'academia', 'library'],
    'cyberpunk': ['cyberpunk', 'neon', 'futuristic', 'cyberpunk aesthetic', 'vaporwave', 'synthwave'],
    'cottagecore': ['cottagecore', 'cottage', 'rural', 'countryside', 'flowers', 'vintage cottage'],
    'y2k': ['y2k', '2000s', 'cyber y2k', 'futuristic', 'metallic', 'space age'],
    'dreamy': ['dreamy', 'ethereal', 'soft', 'pastel', 'clouds', 'fantasy'],
    'moody': ['moody', 'dark', 'grunge', 'melancholy', 'atmospheric', 'noir'],
    'vintage': ['vintage', 'retro', 'film photography', 'old photos', 'nostalgia', 'antique'],
    'grunge': ['grunge', '90s grunge', 'alternative', 'punk', 'distressed', 'edgy'],
    'romantic': ['romantic', 'soft romantic', 'love', 'flowers', 'candlelight', 'vintage romance'],
    'pastel': ['pastel', 'soft colors', 'kawaii', 'cute', 'baby colors', 'sweet'],
    'aesthetic': ['aesthetic', 'tumblr aesthetic', 'mood', 'vibes', 'artsy', 'indie'],
    'punk': ['punk', 'alternative', 'edgy', 'rebel', 'gothic', 'dark'],
    'boho': ['boho', 'bohemian', 'hippie', 'free spirit', 'crystals', 'plants'],
    'glam': ['glam', 'glamorous', 'luxury', 'sparkle', 'gold', 'elegant'],
    'urban': ['urban', 'city', 'street', 'metropolitan', 'concrete', 'modern'],
    'futuristic': ['futuristic', 'sci-fi', 'space', 'technology', 'minimalist', 'clean'],
    'noir': ['noir', 'black and white', 'vintage', 'mystery', 'shadows', 'dramatic']
  }

  const defaultTags = ['aesthetic', 'mood', 'vibes', 'artsy', 'indie']

  const lowerVibe = vibe.toLowerCase()
  
  // Find matching vibe or use default
  for (const [key, tags] of Object.entries(vibeToTagsMap)) {
    if (lowerVibe.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerVibe)) {
      return tags
    }
  }

  return defaultTags
}

// Search specific Tumblr blogs known for aesthetic content
export async function searchAestheticBlogs(vibe: string, limit: number = 12): Promise<TumblrPost[]> {
  if (!TUMBLR_API_KEY) {
    console.error('Tumblr API key not found')
    return []
  }

  // Curated list of aesthetic blogs for different vibes
  const aestheticBlogs: Record<string, string[]> = {
    'girlblogger': ['girlblogger', 'coquette-aesthetic', 'soft-grunge', 'indie-girl'],
    'indie sleaze': ['indie-sleaze', 'hipster-aesthetic', 'vintage-party'],
    'dark academia': ['dark-academia', 'light-academia', 'bookish-aesthetic'],
    'cottagecore': ['cottagecore', 'cottage-aesthetic', 'rural-aesthetic'],
    'y2k': ['y2k-aesthetic', 'cyber-y2k', '2000s-nostalgia'],
    'cyberpunk': ['cyberpunk-aesthetic', 'neon-aesthetic', 'vaporwave'],
    'default': ['aesthetic', 'indie-aesthetic', 'soft-aesthetic']
  }

  const tags = mapVibeToTumblrTags(vibe)
  const blogsToSearch = aestheticBlogs[vibe.toLowerCase()] || aestheticBlogs.default
  
  const allPosts: TumblrPost[] = []

  try {
    // Search multiple blogs and tags
    for (const blog of blogsToSearch.slice(0, 2)) {
      for (const tag of tags.slice(0, 2)) {
        const response = await fetch(
          `${TUMBLR_API_BASE}/tagged?tag=${encodeURIComponent(tag)}&api_key=${TUMBLR_API_KEY}&limit=5&filter=photo`,
          { 
            headers: {
              'User-Agent': 'palette-moodboard-app/1.0'
            }
          }
        )

        if (!response.ok) {
          console.error(`Tumblr API request failed: ${response.status}`)
          continue
        }

        const data: TumblrResponse = await response.json()
        const photoPosts = data.response.posts.filter(post => 
          post.type === 'photo' && post.photos && post.photos.length > 0
        )
        
        allPosts.push(...photoPosts)
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // Deduplicate and filter for quality
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    )

    // Filter for better quality images
    const qualityPosts = uniquePosts.filter(post => {
      if (!post.photos || post.photos.length === 0) return false
      
      const photo = post.photos[0]
      if (!photo.original_size) return false
      
      // Filter out very small images
      if (photo.original_size.width < 300 || photo.original_size.height < 300) return false
      
      return true
    })

    return qualityPosts.slice(0, limit)
  } catch (error) {
    console.error('Error searching Tumblr:', error)
    return []
  }
}

// Search Tumblr posts by tag with enhanced filtering
export async function searchTumblrByTag(vibe: string, limit: number = 12): Promise<TumblrPost[]> {
  if (!TUMBLR_API_KEY) {
    console.error('Tumblr API key not found')
    return []
  }

  const tags = mapVibeToTumblrTags(vibe)
  const allPosts: TumblrPost[] = []

  try {
    // Search with primary tags
    for (const tag of tags.slice(0, 3)) {
      const response = await fetch(
        `${TUMBLR_API_BASE}/tagged?tag=${encodeURIComponent(tag)}&api_key=${TUMBLR_API_KEY}&limit=${Math.ceil(limit / 3)}&filter=photo&before=${Date.now()}`,
        {
          headers: {
            'User-Agent': 'palette-moodboard-app/1.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Tumblr API request failed: ${response.status}`)
      }

      const data: TumblrResponse = await response.json()
      const photoPosts = data.response.posts.filter(post => 
        post.type === 'photo' && post.photos && post.photos.length > 0
      )
      
      allPosts.push(...photoPosts)
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Deduplicate and sort by engagement/timestamp
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    )

    // Sort by timestamp (newer first) and filter for quality
    const sortedPosts = uniquePosts
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter(post => {
        const photo = post.photos?.[0]
        if (!photo?.original_size) return false
        
        // Quality filters
        return photo.original_size.width >= 400 && photo.original_size.height >= 400
      })

    return sortedPosts.slice(0, limit)
  } catch (error) {
    console.error('Error searching Tumblr by tag:', error)
    return []
  }
}

// Get best image URL from Tumblr photo
export function getBestTumblrImageUrl(photo: TumblrPhoto, preferredSize: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!photo.alt_sizes || photo.alt_sizes.length === 0) {
    return photo.original_size?.url || ''
  }

  // Sort by size
  const sizes = [...photo.alt_sizes].sort((a, b) => b.width - a.width)
  
  switch (preferredSize) {
    case 'small':
      return sizes[sizes.length - 1]?.url || photo.original_size?.url || ''
    case 'large':
      return sizes[0]?.url || photo.original_size?.url || ''
    case 'medium':
    default:
      const mediumIndex = Math.floor(sizes.length / 2)
      return sizes[mediumIndex]?.url || photo.original_size?.url || ''
  }
}

// Process image for background removal (same as before)
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