import { NextRequest, NextResponse } from 'next/server'
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const TUMBLR_CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY
  const TUMBLR_CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET
  
  if (!TUMBLR_CONSUMER_KEY || !TUMBLR_CONSUMER_SECRET) {
    return NextResponse.json({ 
      error: 'Tumblr OAuth credentials not found',
      hasKey: !!TUMBLR_CONSUMER_KEY,
      hasSecret: !!TUMBLR_CONSUMER_SECRET
    })
  }

  // Initialize OAuth
  const oauth = new OAuth({
    consumer: {
      key: TUMBLR_CONSUMER_KEY,
      secret: TUMBLR_CONSUMER_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64')
    },
  })

  try {
    // Test different authentication methods for /tagged endpoint
    const testCases = [
      // Test with OAuth (current method)
      { type: 'tagged-oauth', query: 'aesthetic', url: 'https://api.tumblr.com/v2/tagged?tag=aesthetic&limit=3', auth: 'oauth' },
      // Test with API key only (no OAuth)
      { type: 'tagged-apikey', query: 'aesthetic', url: `https://api.tumblr.com/v2/tagged?tag=aesthetic&limit=3&api_key=${TUMBLR_CONSUMER_KEY}`, auth: 'apikey' },
      // Test different tag formats
      { type: 'tagged-cats-oauth', query: 'cats', url: 'https://api.tumblr.com/v2/tagged?tag=cats&limit=3', auth: 'oauth' },
      { type: 'tagged-cats-apikey', query: 'cats', url: `https://api.tumblr.com/v2/tagged?tag=cats&limit=3&api_key=${TUMBLR_CONSUMER_KEY}`, auth: 'apikey' },
      // Working blog endpoint for comparison
      { type: 'blog-working', query: 'y2kaesthetic', url: 'https://api.tumblr.com/v2/blog/y2kaesthetic.tumblr.com/posts?limit=3', auth: 'oauth' }
    ]

    const results = []
    
    for (const testCase of testCases) {
      let response: Response
      
      if (testCase.auth === 'oauth') {
        // Use OAuth authentication
        const requestData = { url: testCase.url, method: 'GET' }
        const authHeader = oauth.toHeader(oauth.authorize(requestData))
        
        response = await fetch(testCase.url, {
          method: 'GET',
          headers: {
            ...authHeader,
            'User-Agent': 'palette-moodboard-app/1.0'
          }
        })
      } else {
        // Use API key only (no OAuth)
        response = await fetch(testCase.url, {
          method: 'GET',
          headers: {
            'User-Agent': 'palette-moodboard-app/1.0'
          }
        })
      }

      if (response.ok) {
        const data = await response.json()
        results.push({
          type: testCase.type,
          query: testCase.query,
          status: response.status,
          postsFound: data.response?.posts?.length || 0,
          hasPhotoPosts: data.response?.posts?.filter((p: any) => p.type === 'photo').length || 0,
          rawResponse: {
            meta: data.meta,
            response: data.response ? {
              ...data.response,
              posts: data.response.posts ? `${data.response.posts.length} posts` : 'no posts array'
            } : 'no response object'
          },
          samplePost: data.response?.posts?.[0] ? {
            type: data.response.posts[0].type,
            blog_name: data.response.posts[0].blog_name,
            tags: data.response.posts[0].tags?.slice(0, 3) || []
          } : null
        })
      } else {
        results.push({
          type: testCase.type,
          query: testCase.query,
          status: response.status,
          error: `Failed to fetch: ${response.status}`
        })
      }
    }

    return NextResponse.json({
      success: true,
      hasKey: true,
      hasSecret: true,
      testResults: results,
      summary: {
        totalTestsConducted: results.length,
        successfulRequests: results.filter(r => !r.error).length,
        testsWithPosts: results.filter(r => r.postsFound > 0).length,
        testsWithPhotos: results.filter(r => r.hasPhotoPosts > 0).length,
        hashtagTests: results.filter(r => r.type === 'hashtag').length,
        blogTests: results.filter(r => r.type === 'blog').length
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error',
      hasKey: true,
      hasSecret: true
    })
  }
}