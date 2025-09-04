import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import { filterNSFWContent, filterLowQuality } from './aesthetic-mapping'

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
    return crypto.createHmac('sha1', key).update(base_string).digest('base64')
  },
})

// Authenticated request helper
async function makeAuthenticatedTumblrRequest(url: string): Promise<Response> {
  const requestData = { url, method: 'GET' }
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
  alt_sizes: Array<{ url: string; width: number; height: number }>
  original_size: { url: string; width: number; height: number }
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
  body?: string
  title?: string
}

interface TumblrResponse {
  response: { posts: TumblrPost[]; total_posts?: number }
}

// 🎯 Expanded product / wishlist tags (original version, merged in full)
const productTags: Record<string, string[]> = {
  designers: [
    'prada', 'miu miu', 'dior', 'gucci', 'ysl', 'celine', 'versace', 'armani',
    'chanel', 'hermes', 'bottega veneta', 'saint laurent', 'balenciaga', 'fendi', 'givenchy'
  ],
  clothes: [
    'lace top', 'corset', 'silk dress', 'mini skirt', 'maxi dress', 'crop top',
    'blazer', 'cardigan', 'leather jacket', 'denim jacket', 'trench coat',
    'pyjama set', 'lingerie', 'bodysuit', 'palazzo pants'
  ],
  accessories: [
    'locket', 'gold bracelet', 'silver ring', 'pearl necklace', 'chain necklace',
    'handbag', 'tote bag', 'clutch bag', 'crossbody bag', 'sunglasses',
    'designer bag', 'vintage jewelry', 'hair clips', 'silk scarf'
  ],
  beauty: [
    'lipstick', 'lip gloss', 'dior lip oil', 'charlotte tilbury', 'rare beauty',
    'fenty beauty', 'glossier', 'perfume bottle', 'chanel perfume', 'tom ford beauty',
    'eyeshadow palette', 'blush compact', 'foundation', 'concealer'
  ],
  lifestyle: [
    'polaroid camera', 'digital camera', 'vintage camera', 'gold mirror', 'vanity mirror',
    'airpods', 'headphones', 'stanley cup', 'water bottle', 'silk pillowcase',
    'candles', 'books', 'notebook', 'planner'
  ],
  footwear: [
    'heels', 'stilettos', 'pumps', 'boots', 'ankle boots', 'sneakers', 'loafers',
    'ballet flats', 'sandals', 'platform shoes', 'designer shoes', 'jimmy choo', 'christian louboutin'
  ],
  jewelry: [
    'diamond ring', 'gold jewelry', 'silver jewelry', 'pearl earrings', 'hoop earrings',
    'statement necklace', 'tennis bracelet', 'charm bracelet', 'vintage jewelry', 'cartier', 'tiffany'
  ]
}

// ✅ Simple demo-friendly Tumblr fetch with aesthetic/product fallback terms
export async function fetchWishlistPosts(limit: number = 12): Promise<TumblrPost[]> {
  if (!TUMBLR_CONSUMER_KEY || !TUMBLR_CONSUMER_SECRET) {
    console.error('Tumblr OAuth credentials not found')
    return []
  }

  // Fallback terms that reliably return posts for demo purposes
  const searchTerms = [
    'wishlist', 'shopping haul', 'cute things', 'girly stuff', 'aesthetic objects',
    'coquette', 'makeup', 'skincare', 'outfit inspo', 'designer bag', 'fashion aesthetic'
  ]

  const allPosts: TumblrPost[] = []

  try {
    for (const term of searchTerms) {
      const url = `${TUMBLR_API_BASE}/tagged?tag=${encodeURIComponent(term)}&limit=20`
      const response = await makeAuthenticatedTumblrRequest(url)
      if (!response.ok) continue

      const data = await response.json()
      const posts = (data.response || []).filter(
        (p: any) => p.type === 'photo' && p.photos?.length > 0
      )

      allPosts.push(...posts)
      if (allPosts.length >= limit * 2) break

      await new Promise(r => setTimeout(r, 100)) // rate limit
    }

    // Deduplicate by image URL
    const seen = new Set()
    const unique = allPosts.filter(post => {
      const url = post.photos?.[0]?.original_size?.url
      if (!url || seen.has(url)) return false
      seen.add(url)
      return true
    })

    return unique.slice(0, limit)
  } catch (err) {
    console.error('Error fetching wishlist posts:', err)
    return []
  }
}

// ✅ Alias to keep your app code working
export const searchTumblrByTaggedEndpoint = fetchWishlistPosts

// ✅ Utility: choose best Tumblr image URL based on size
export function getBestTumblrImageUrl(
  photo: any,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!photo) return ''

  // Tumblr provides alt_sizes sorted largest → smallest
  if (!photo.alt_sizes || photo.alt_sizes.length === 0) {
    return photo.original_size?.url || ''
  }

  switch (size) {
    case 'small':
      return photo.alt_sizes[photo.alt_sizes.length - 1]?.url || photo.original_size?.url || ''
    case 'large':
      return photo.alt_sizes[0]?.url || photo.original_size?.url || ''
    case 'medium':
    default:
      const mid = Math.floor(photo.alt_sizes.length / 2)
      return photo.alt_sizes[mid]?.url || photo.original_size?.url || ''
  }
}
export async function processImageForTransparency(imageUrl: string): Promise<string> {
  return imageUrl // hook up remove.bg later if needed
}
