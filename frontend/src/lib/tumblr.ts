import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import { filterNSFWContent, filterLowQuality, NSFW_KEYWORDS } from './aesthetic-mapping'

const TUMBLR_CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY
const TUMBLR_CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET
const TUMBLR_API_BASE = 'https://api.tumblr.com/v2'

// Initialize OAuth 1.0a
const oauth = new OAuth({
  consumer: {
    key: TUMBLR_CONSUMER_KEY!,
    secret: TUMBLR_CONSUMER_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64')
  },
})

// Helper function to make authenticated requests to Tumblr API
async function makeAuthenticatedTumblrRequest(url: string): Promise<Response> {
  const requestData = {
    url,
    method: 'GET',
  }

  const authHeader = oauth.toHeader(oauth.authorize(requestData))
  
  return fetch(url, {
    method: 'GET',
    headers: {
      ...authHeader,
      'User-Agent': 'palette-moodboard-app/1.0',
    },
  })
}

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
  body?: string // For text posts
  title?: string // For text posts
}

interface TumblrResponse {
  response: {
    posts: TumblrPost[]
    total_posts?: number
  }
}

// Enhanced vibe to Tumblr tag mapping for authentic aesthetic content
export function mapVibeToTumblrTags(vibe: string): string[] {
  // These are the ACTUAL tags that real Tumblr users use for these aesthetics
  const vibeToTagsMap: Record<string, string[]> = {
    'girlblogger': ['girlblogger', 'coquette', 'coquetteaesthetic', 'dollette', 'nymphet', 'soft girl', 'lana del rey', 'vintage', 'books', 'poetry', 'coffee', 'film photography', 'lolita', 'feminine'],
    'indie sleaze': ['indie sleaze', 'indiesleaze', 'hipster', 'party', '2000s', 'flash photography', 'cigarettes', 'american apparel', 'vintage', 'grunge', 'hipster girl', 'party aesthetic'],
    'pink pilates princess': ['pilates princess', 'clean girl', 'that girl', 'pink', 'pilates', 'wellness', 'healthy', 'pink aesthetic', 'workout', 'fitness', 'yoga', 'smoothie'],
    'coastal grandmother': ['coastal grandmother', 'linen', 'neutral', 'beige', 'minimalist', 'coastal', 'nancy meyers', 'hygge', 'scandinavian', 'white', 'simple living'],
    'dark academia': ['dark academia', 'darkacademia', 'light academia', 'academia', 'books', 'library', 'vintage', 'oxford', 'classic literature', 'poetry', 'tweed', 'autumn', 'study'],
    'cyberpunk': ['cyberpunk', 'neon', 'synthwave', 'vaporwave', 'retrowave', 'futuristic', 'blade runner', 'cyberpunk aesthetic', 'neon lights', 'city night'],
    'cottagecore': ['cottagecore', 'cottage core', 'rural', 'countryside', 'flowers', 'garden', 'mushrooms', 'forest', 'fairy', 'vintage', 'nature', 'bread'],
    'y2k': ['y2k', 'y2k aesthetic', '2000s', 'cyber y2k', 'metallic', 'holographic', 'space age', 'futuristic', 'matrix', 'tech'],
    'dreamy': ['dreamy', 'ethereal', 'soft', 'pastel', 'clouds', 'fantasy', 'fairy', 'magic', 'whimsical', 'romantic'],
    'moody': ['moody', 'dark', 'grunge', 'melancholy', 'sad', 'noir', 'black', 'gothic', 'alternative'],
    'vintage': ['vintage', 'retro', 'film photography', 'old photos', 'nostalgia', 'antique', '70s', '80s', '90s'],
    'grunge': ['grunge', '90s', 'alternative', 'nirvana', 'punk', 'distressed', 'edgy', 'kurt cobain', 'flannel'],
    'romantic': ['romantic', 'love', 'flowers', 'roses', 'soft', 'feminine', 'valentine', 'pink', 'lace'],
    'pastel': ['pastel', 'soft', 'kawaii', 'cute', 'pink', 'blue', 'purple', 'sweet', 'baby'],
    'aesthetic': ['aesthetic', 'tumblr aesthetic', 'mood', 'vibes', 'artsy', 'indie', 'photography'],
    'punk': ['punk', 'alternative', 'edgy', 'rebel', 'gothic', 'black', 'spikes', 'leather'],
    'boho': ['boho', 'bohemian', 'hippie', 'free spirit', 'crystals', 'plants', 'macrame', 'vintage'],
    'glam': ['glam', 'glamorous', 'luxury', 'gold', 'sparkle', 'elegant', 'fashion', 'expensive'],
    'urban': ['urban', 'city', 'street', 'graffiti', 'architecture', 'modern', 'photography'],
    'futuristic': ['futuristic', 'sci-fi', 'space', 'technology', 'minimalist', 'clean', 'white'],
    'noir': ['noir', 'black and white', 'vintage', 'mystery', 'shadows', 'film noir', 'dramatic']
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
  if (!TUMBLR_CONSUMER_KEY || !TUMBLR_CONSUMER_SECRET) {
    console.error('Tumblr OAuth credentials not found')
    return []
  }

  // Broader list including popular aesthetic blogs that often have tagged content
  const aestheticBlogs: Record<string, string[]> = {
    'girlblogger': ['girlblogger', 'coquetteaesthetic', 'dollette', 'nymphetfashion', 'vintagevisual', 'softgrunge', 'indie-cinema', 'bookshelfporn', 'poetry-and-coffee', 'lanaesthetic'],
    'indie sleaze': ['indiesleaze', 'vintagevisual', 'indiecinema', 'softgrunge', 'alternativestyle', 'party-photography', 'flashphotography', 'hipster-aesthetic', 'american-apparel'],
    'dark academia': ['darkacademia', 'darkacademiavisual', 'classical-beauty', 'bookshelfporn', 'vintagevisual', 'studyblr', 'academicaestheticss', 'library-aesthetic', 'literature-quotes'],
    'cottagecore': ['cottagecore', 'cottagecore-aesthetic', 'nature-photography', 'vintagevisual', 'rural-aesthetic', 'fairytale-aesthetic', 'forest-photography', 'mushroom-foraging'],
    'y2k': ['y2k-aesthetic', 'cyber-y2k', 'retrotech', 'vintagevisual', '2000s-nostalgia', 'cyber-aesthetic', 'retro-futurism', 'matrix-aesthetic'],
    'cyberpunk': ['cyberpunk-aesthetic', 'neon-photography', 'futuristic-art', 'synthwave-aesthetic', 'retrowave', 'vaporwave-aesthetic', 'cyberpunk2077', 'neon-lights'],
    'pink pilates princess': ['pilates-princess', 'fitness-aesthetic', 'pink-aesthetic', 'clean-girl', 'wellness-aesthetic', 'that-girl-aesthetic', 'pilates-girl', 'health-wellness'],
    'coastal grandmother': ['coastal-grandmother', 'coastal-aesthetic', 'linen-aesthetic', 'minimalist-home', 'neutral-tones', 'scandinavian-style', 'hygge-aesthetic', 'nancy-meyers'],
    'default': ['aesthetic', 'aesthetic-photography', 'vintage-style', 'art-aesthetic', 'photography', 'visualsoflife', 'indie-aesthetic', 'tumblr-aesthetic']
  }

  const tags = mapVibeToTumblrTags(vibe)
  const blogsToSearch = aestheticBlogs[vibe.toLowerCase()] || aestheticBlogs.default
  
  const allPosts: TumblrPost[] = []

  try {
    // Updated blog list based on verified working blogs with photo content and proper tags
    const verifiedTaggedBlogs: Record<string, string[]> = {
      'girlblogger': ['softgrungeaesthetic', 'lanadelrey', 'cottagecore', 'y2kaesthetic', 'art', 'aesthetic'],
      'coquette': ['softgrungeaesthetic', 'lanadelrey', 'cottagecore', 'y2kaesthetic', 'art', 'aesthetic'],
      'dark academia': ['lanadelrey', 'cottagecore', 'art', 'aesthetic', 'y2kaesthetic'],
      'y2k': ['y2kaesthetic', 'softgrungeaesthetic', 'art', 'aesthetic', 'cottagecore'],
      'cyberpunk': ['y2kaesthetic', 'softgrungeaesthetic', 'art', 'aesthetic', 'cottagecore'],
      'cottagecore': ['cottagecore', 'lanadelrey', 'y2kaesthetic', 'softgrungeaesthetic', 'art'],
      'default': ['y2kaesthetic', 'softgrungeaesthetic', 'lanadelrey', 'cottagecore', 'art']
    }

    const targetBlogs = verifiedTaggedBlogs[vibe.toLowerCase()] || verifiedTaggedBlogs.default
    
    console.log(`🎯 Searching verified tagged blogs for "${vibe}":`, targetBlogs.slice(0, 4))

    // Search verified tagged blogs
    for (const blog of targetBlogs.slice(0, 8)) {
      const url = `${TUMBLR_API_BASE}/blog/${blog}.tumblr.com/posts?limit=15`
      const response = await makeAuthenticatedTumblrRequest(url)

      if (!response.ok) {
        console.log(`Blog ${blog} not accessible (${response.status})`)
        continue
      }

      const data: TumblrResponse = await response.json()
      if (!data.response?.posts) {
        continue
      }

      // Get photo posts and prioritize those with tags
      const postsWithPhotos = data.response.posts.filter(post => 
        post.type === 'photo' && post.photos && post.photos.length > 0
      )
      
      const postsWithTags = postsWithPhotos.filter(post => post.tags && post.tags.length > 0)
      const postsWithoutTags = postsWithPhotos.filter(post => !post.tags || post.tags.length === 0)
      
      console.log(`Found ${postsWithPhotos.length} photo posts from ${blog} (${postsWithTags.length} with tags)`)
      
      // Add tagged posts first, then untagged ones as fallback
      allPosts.push(...postsWithTags, ...postsWithoutTags)
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Deduplicate and filter for quality
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    )

    // Filter for better quality images, vibe relevance, and NSFW content
    const qualityPosts = uniquePosts.filter(post => {
      if (!post.photos || post.photos.length === 0) {
        console.log(`❌ Filtered out post from ${post.blog_name}: no photos`)
        return false
      }
      
      const photo = post.photos[0]
      if (!photo.original_size) {
        console.log(`❌ Filtered out post from ${post.blog_name}: no original_size`)
        return false
      }
      
      // Filter out very small images
      if (photo.original_size.width < 400 || photo.original_size.height < 400) {
        console.log(`❌ Filtered out post from ${post.blog_name}: too small (${photo.original_size.width}x${photo.original_size.height})`)
        return false
      }
      
      // NSFW content filtering
      const nsfw_keywords = ['nsfw', 'adult', 'nude', 'naked', 'porn', 'sex', 'xxx', 'mature', 'explicit', 'erotic']
      const postTags = (post.tags || []).map(tag => tag.toLowerCase())
      const summary = (post.summary || '').toLowerCase()
      const caption = (post.caption || '').toLowerCase()
      
      const hasNSFWTag = postTags.some(tag => 
        nsfw_keywords.some(keyword => tag.includes(keyword))
      )
      const hasNSFWContent = nsfw_keywords.some(keyword => 
        summary.includes(keyword) || caption.includes(keyword)
      )
      
      if (hasNSFWTag || hasNSFWContent) {
        console.log(`Filtered out NSFW post from ${post.blog_name}`)
        return false
      }
      
      // Enhanced vibe matching - accept related aesthetic tags
      const vibeKeywords = mapVibeToTumblrTags(vibe).map(tag => tag.toLowerCase())
      const postText = `${(post.summary || '')} ${(post.caption || '')}`.toLowerCase()
      
      // Add related aesthetic keywords for broader matching
      const aestheticKeywords = [
        'aesthetic', 'grunge', 'vintage', 'soft', 'photography', 'art', 'style', 
        'mood', 'vibe', 'lana del rey', 'honeymoon', 'cute', 'pretty', 'dreamy',
        'nostalgic', 'retro', 'tumblr', 'indie', 'alternative', 'dark', 'light'
      ]
      
      const allRelevantTags = [...vibeKeywords, ...aestheticKeywords]
      
      console.log(`Checking post from ${post.blog_name} with ${postTags.length} tags:`, postTags.slice(0, 3))
      
      if (postTags.length > 0) {
        // Check for exact tag matches first
        const hasExactTag = postTags.some(tag => 
          allRelevantTags.includes(tag.toLowerCase())
        )
        
        // Check for partial tag matches with aesthetic terms
        const hasPartialTag = postTags.some(tag => {
          const tagLower = tag.toLowerCase()
          return allRelevantTags.some(keyword => 
            tagLower.includes(keyword) || keyword.includes(tagLower)
          )
        })
        
        const isTagRelevant = hasExactTag || hasPartialTag
        
        if (isTagRelevant) {
          const matchedTags = postTags.filter(tag => {
            const tagLower = tag.toLowerCase()
            return allRelevantTags.some(keyword => tagLower.includes(keyword) || keyword.includes(tagLower))
          })
          console.log(`🏷️ Found ${vibe} post from ${post.blog_name} with tags:`, matchedTags)
          return true
        }
      }
      
      // If no tags or no tag matches, check content and blog name
      const hasRelevantContent = vibeKeywords.some(keyword => 
        postText.includes(keyword.toLowerCase())
      )
      
      const hasRelevantBlogName = vibeKeywords.some(keyword => 
        post.blog_name.toLowerCase().includes(keyword.toLowerCase())
      )
      
      if (hasRelevantContent) {
        console.log(`📝 Content match for ${vibe}`)
        return true
      }
      
      if (hasRelevantBlogName) {
        console.log(`🏷️ Blog name match for ${vibe}: ${post.blog_name}`)
        return true
      }
      
      console.log(`❌ No match for ${vibe} from ${post.blog_name}`)
      return false
    })

    console.log(`📊 Quality filtering: ${uniquePosts.length} unique posts → ${qualityPosts.length} quality posts`)
    return qualityPosts.slice(0, limit)
  } catch (error) {
    console.error('Error searching Tumblr blogs:', error)
    return []
  }
}

// Search Tumblr posts by tag with enhanced filtering
// Enhanced Tumblr search using aesthetic API mappings
export async function searchTumblrByTaggedEndpoint(
  vibe: string, 
  limit: number = 12, 
  apiTags?: any // Enhanced API tags from aesthetic analysis
): Promise<TumblrPost[]> {
  if (!TUMBLR_CONSUMER_KEY || !TUMBLR_CONSUMER_SECRET) {
    console.error('Missing Tumblr OAuth credentials')
    return []
  }

  console.log(`📱 Enhanced Tumblr search for vibe: ${vibe}`)
  
  // Use enhanced API mappings if available, otherwise fall back to legacy mapping
  let searchTags: string[] = []
  if (apiTags?.tumblr) {
    searchTags = [
      ...apiTags.tumblr.primary_tags.slice(0, 2),
      ...apiTags.tumblr.secondary_tags.slice(0, 2),
      vibe // Always include the original vibe as fallback
    ]
    console.log(`✨ Using enhanced Tumblr mapping:`, searchTags.slice(0, 3))
  } else {
    searchTags = mapVibeToTumblrTags(vibe)
    console.log(`📝 Using legacy Tumblr mapping:`, searchTags.slice(0, 3))
  }
  
  const allPosts: TumblrPost[] = []
  
  try {
    // Use the /tagged endpoint directly with the most relevant tags
    for (const tag of searchTags.slice(0, 4)) { // Search more tags for better coverage
      const url = `${TUMBLR_API_BASE}/tagged?tag=${encodeURIComponent(tag)}&limit=${Math.min(limit, 20)}`
      const response = await makeAuthenticatedTumblrRequest(url)

      if (!response.ok) {
        console.log(`Tagged endpoint failed for ${tag}: ${response.status}`)
        continue
      }

      const data = await response.json()
      const posts = data.response || []
      
      console.log(`🎯 /tagged endpoint found ${posts.length} posts for tag "${tag}"`)

      // Process all posts that contain images (not just photo type)
      const relevantPosts = posts.filter((post: any) => {
        // Check for photo posts
        if (post.type === 'photo' && post.photos && post.photos.length > 0) return true
        
        // Check for text posts (both with embedded images and quotes)
        if (post.type === 'text' && post.body) return true
        
        return false
      })

      console.log(`📸 Found ${relevantPosts.length} relevant posts (images and text) for tag "${tag}"`)
      
      // Convert to our format
      for (const post of relevantPosts) {
        try {
          console.log(`🔍 Processing ${post.type} post from ${post.blog_name}`)
          let photos = []
          
          if (post.type === 'photo' && post.photos) {
            // Filter out GIFs from photo posts too
            photos = post.photos.filter((photo: any) => 
              !photo.original_size?.url?.toLowerCase().includes('.gif')
            )
            console.log(`📷 Photo post has ${photos.length} photos (filtered out GIFs)`)
          } else if (post.type === 'text' && post.body) {
            // Extract images from text post HTML
            console.log(`📝 Extracting images from text post body (${post.body.length} chars)`)
            
            // First try to get images with dimension data
            let imgMatches = [...post.body.matchAll(/<img[^>]+src="([^"]+)"[^>]*data-orig-width="(\d+)"[^>]*data-orig-height="(\d+)"/g)]
            console.log(`🖼️ Found ${imgMatches.length} image matches with dimensions`)
            
            // If no matches with dimensions, get all images and extract dimensions differently
            if (imgMatches.length === 0) {
              const simpleImgMatches = [...post.body.matchAll(/<img[^>]+src="([^"]+)"[^>]*(?:data-orig-width="(\d+)")?[^>]*(?:data-orig-height="(\d+)")?/g)]
              console.log(`🔍 Found ${simpleImgMatches.length} simple img matches`)
              imgMatches = simpleImgMatches
            }
            
            photos = imgMatches.map((match, index) => {
              const url = match[1]
              const width = match[2] ? parseInt(match[2]) : 640  // Default width if not found
              const height = match[3] ? parseInt(match[3]) : 640  // Default height if not found
              
              console.log(`📷 Image ${index + 1}: ${width}x${height} - ${url.substring(0, 50)}...`)
              
              return {
                caption: '',
                original_size: {
                  url: url,
                  width: width,
                  height: height
                },
                alt_sizes: [
                  {
                    url: url,
                    width: width,
                    height: height
                  }
                ]
              }
            }).filter(photo => 
              photo.original_size.url && 
              photo.original_size.url.includes('media.tumblr.com') &&
              !photo.original_size.url.toLowerCase().includes('.gif')
            )
            
            console.log(`✅ Successfully converted ${photos.length} photos`)
          }

          if (photos.length > 0) {
            allPosts.push({ type: post.type,
              id: post.id_string || post.id.toString(),
              blog_name: post.blog_name,
              post_url: post.post_url,
              tags: post.tags || [],
              timestamp: post.timestamp,
              photos: photos,
              summary: post.summary || '',
              caption: post.body ? post.body.substring(0, 200) : ''
            })
            console.log(`✅ Added post from ${post.blog_name} with ${photos.length} photos`)
          } else {
            console.log(`❌ No photos extracted from ${post.type} post from ${post.blog_name}`)
          }
        } catch (err) {
          console.log(`❌ Error processing post from tag ${tag}:`, err)
        }
      }
      
      console.log(`✅ Processed ${allPosts.length} posts so far`)

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Enhanced NSFW and quality filtering using the new filter functions
    const filteredPosts = allPosts.filter(post => {
      // Use enhanced quality filter
      if (!filterLowQuality(post, 'tumblr')) {
        console.log(`❌ Quality filtered: post from ${post.blog_name}`)
        return false
      }
      
      // Enhanced NSFW filtering
      const postContent = [
        ...(post.tags || []),
        post.summary || '',
        post.caption || ''
      ].join(' ')
      
      if (!filterNSFWContent(post.tags || [], postContent)) {
        console.log(`❌ NSFW filtered: post from ${post.blog_name}`)
        return false
      }
      
      // Additional aesthetic relevance check for enhanced mappings
      if (apiTags?.tumblr) {
        const postTags = (post.tags || []).map(tag => tag.toLowerCase())
        const allRelevantTags = [
          ...apiTags.tumblr.primary_tags,
          ...apiTags.tumblr.secondary_tags,
          ...apiTags.tumblr.related_hashtags,
          vibe.toLowerCase()
        ].map(tag => tag.toLowerCase())
        
        const hasRelevantTag = postTags.some(tag => 
          allRelevantTags.some(relevantTag => 
            tag.includes(relevantTag) || relevantTag.includes(tag)
          )
        )
        
        if (!hasRelevantTag && postTags.length > 0) {
          console.log(`❌ Aesthetic relevance filtered: ${post.blog_name} tags don't match ${vibe}`)
          return false
        }
      }
      
      console.log(`✅ Approved post from ${post.blog_name} with ${post.tags?.length || 0} tags`)
      return true
    })

    console.log(`✅ /tagged endpoint final result: ${filteredPosts.length} quality posts`)
    return filteredPosts.slice(0, limit)
    
  } catch (error) {
    console.error('Error using /tagged endpoint:', error)
    return []
  }
}

export async function searchTumblrByTag(vibe: string, limit: number = 12): Promise<TumblrPost[]> {
  if (!TUMBLR_CONSUMER_KEY || !TUMBLR_CONSUMER_SECRET) {
    console.error('Tumblr OAuth credentials not found')
    return []
  }

  const targetTags = mapVibeToTumblrTags(vibe)
  console.log(`🎯 Looking for posts with tags:`, targetTags.slice(0, 6))
  
  // Search blogs that are known to tag their content heavily
  const heavilyTaggedBlogs = [
    // These blogs typically use lots of tags
    'aesthetic-sharer', 'moodboard-central', 'aesthetic-vibes', 'tagged-content',
    'vintage-tagged', 'aesthetic-blog', 'moodboards', 'vibes-only',
    // Plus some that worked before
    'y2kaesthetic', 'aesthetic', 'vintage', 'photography', 'art'
  ]
  
  const allPosts: TumblrPost[] = []

  try {
    // Search many blogs to find posts that have our target tags
    for (const blog of heavilyTaggedBlogs) {
      const url = `${TUMBLR_API_BASE}/blog/${blog}.tumblr.com/posts?limit=20`
      const response = await makeAuthenticatedTumblrRequest(url)

      if (!response.ok) {
        continue // Skip inaccessible blogs
      }

      const data: TumblrResponse = await response.json()
      if (!data.response?.posts) continue

      // Get photo posts and check if they have our target tags
      const photoPosts = data.response.posts.filter(post => 
        post.type === 'photo' && post.photos && post.photos.length > 0
      )
      
      // Only keep posts that have tags matching our vibe
      const taggedPosts = photoPosts.filter(post => {
        if (!post.tags || post.tags.length === 0) return false
        
        const postTags = post.tags.map(tag => tag.toLowerCase())
        const hasTargetTag = postTags.some(tag => 
          targetTags.some(targetTag => 
            tag.includes(targetTag.toLowerCase()) || targetTag.toLowerCase().includes(tag)
          )
        )
        
        if (hasTargetTag) {
          const matchedTags = postTags.filter(tag => 
            targetTags.some(targetTag => tag.includes(targetTag.toLowerCase()) || targetTag.toLowerCase().includes(tag))
          )
          console.log(`🏷️ Found ${vibe} post from ${blog} with tags:`, matchedTags)
          return true
        }
        return false
      })
      
      allPosts.push(...taggedPosts)
      
      if (allPosts.length >= limit * 2) break // Stop when we have enough candidates
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`📊 Found ${allPosts.length} tagged posts across all blogs`)

    // Deduplicate and filter for quality  
    const uniquePosts = allPosts.filter((post, index, self) => 
      index === self.findIndex(p => p.id === post.id)
    )
    
    console.log(`🔄 After deduplication: ${uniquePosts.length} unique posts`)

    // Apply quality and NSFW filtering
    const filteredPosts = uniquePosts.filter(post => {
      const photo = post.photos?.[0]
      if (!photo?.original_size) {
        console.log(`❌ Filtered out post from ${post.blog_name}: no original_size`)
        return false
      }
      if (photo.original_size.width < 300 || photo.original_size.height < 300) {
        console.log(`❌ Filtered out post from ${post.blog_name}: too small (${photo.original_size.width}x${photo.original_size.height})`)
        return false
      }
      
      // NSFW filtering
      const nsfw_keywords = ['nsfw', 'adult', 'nude', 'naked', 'porn', 'sex', 'xxx', 'mature', 'explicit', 'erotic']
      const postTags = (post.tags || []).map(tag => tag.toLowerCase())
      const hasNSFW = postTags.some(tag => nsfw_keywords.some(keyword => tag.includes(keyword)))
      
      return !hasNSFW
    })

    console.log(`✅ Final result: ${filteredPosts.length} quality tagged posts for "${vibe}"`)
    return filteredPosts.slice(0, limit)
    
  } catch (error) {
    console.error('Error searching for tagged posts:', error)
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