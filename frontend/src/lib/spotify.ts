const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'

// Get Spotify access token using Client Credentials flow
async function getSpotifyAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.error('Spotify credentials not found in environment variables')
    return null
  }

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    })

    if (!response.ok) {
      throw new Error(`Token request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting Spotify access token:', error)
    return null
  }
}

// Search for tracks based on genre and vibe keywords
export async function searchTracks(query: string, limit: number = 20): Promise<any[]> {
  const token = await getSpotifyAccessToken()
  if (!token) return []

  try {
    const searchQuery = encodeURIComponent(query)
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${searchQuery}&type=track&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Search request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.tracks.items || []
  } catch (error) {
    console.error('Error searching tracks:', error)
    return []
  }
}

// Get recommendations based on seed genres, artists, or tracks
export async function getRecommendations(params: {
  seed_genres?: string[]
  seed_artists?: string[]
  seed_tracks?: string[]
  target_energy?: number
  target_valence?: number
  target_danceability?: number
  limit?: number
}): Promise<any[]> {
  const token = await getSpotifyAccessToken()
  if (!token) return []

  try {
    const queryParams = new URLSearchParams()
    
    if (params.seed_genres?.length) {
      queryParams.append('seed_genres', params.seed_genres.join(','))
    }
    if (params.seed_artists?.length) {
      queryParams.append('seed_artists', params.seed_artists.join(','))
    }
    if (params.seed_tracks?.length) {
      queryParams.append('seed_tracks', params.seed_tracks.join(','))
    }
    if (params.target_energy !== undefined) {
      queryParams.append('target_energy', params.target_energy.toString())
    }
    if (params.target_valence !== undefined) {
      queryParams.append('target_valence', params.target_valence.toString())
    }
    if (params.target_danceability !== undefined) {
      queryParams.append('target_danceability', params.target_danceability.toString())
    }
    
    queryParams.append('limit', (params.limit || 20).toString())

    const response = await fetch(
      `${SPOTIFY_API_BASE}/recommendations?${queryParams.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Recommendations request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.tracks || []
  } catch (error) {
    console.error('Error getting recommendations:', error)
    return []
  }
}

// Get available genre seeds
export async function getAvailableGenres(): Promise<string[]> {
  const token = await getSpotifyAccessToken()
  if (!token) return []

  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/recommendations/available-genre-seeds`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Genre seeds request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.genres || []
  } catch (error) {
    console.error('Error getting available genres:', error)
    return []
  }
}

// Enhanced vibe to music mapping incorporating lastfm_ontology.json patterns
export function mapVibeToSpotifyParams(vibe: string): {
  genres: string[]
  energy: number
  valence: number
  danceability: number
  searchTerms: string[]
} {
  const vibeMap: Record<string, any> = {
    'girlblogger': {
      genres: ['indie-pop', 'dream-pop', 'indie-rock'],
      energy: 0.5,
      valence: 0.6,
      danceability: 0.5,
      searchTerms: ['Lana Del Rey', 'Mitski', 'Phoebe Bridgers', 'indie girl', 'tumblr music']
    },
    'indie sleaze': {
      genres: ['indie-rock', 'alternative', 'garage', 'post-punk'],
      energy: 0.7,
      valence: 0.4,
      danceability: 0.6,
      searchTerms: ['The Strokes', 'Yeah Yeah Yeahs', 'Interpol', 'garage rock', 'indie sleaze']
    },
    'pink pilates princess': {
      genres: ['pop', 'dance-pop', 'indie-pop'],
      energy: 0.6,
      valence: 0.8,
      danceability: 0.7,
      searchTerms: ['Dua Lipa', 'Charli XCX', 'pop princess', 'workout music', 'feel good pop']
    },
    'coastal grandmother': {
      genres: ['folk', 'indie-folk', 'acoustic', 'singer-songwriter'],
      energy: 0.3,
      valence: 0.7,
      danceability: 0.4,
      searchTerms: ['Joni Mitchell', 'Carole King', 'folk', 'acoustic', 'mellow']
    },
    'dark academia': {
      genres: ['classical', 'ambient', 'indie', 'post-rock'],
      energy: 0.2,
      valence: 0.3,
      danceability: 0.3,
      searchTerms: ['classical', 'instrumental', 'dark ambient', 'study music', 'moody']
    },
    'cyberpunk': {
      genres: ['electronic', 'techno', 'synthwave', 'industrial'],
      energy: 0.8,
      valence: 0.4,
      danceability: 0.8,
      searchTerms: ['synthwave', 'cyberpunk', 'electronic', 'futuristic', 'neon']
    },
    'cottagecore': {
      genres: ['folk', 'indie-folk', 'country', 'acoustic'],
      energy: 0.4,
      valence: 0.8,
      danceability: 0.3,
      searchTerms: ['folk', 'country', 'acoustic', 'pastoral', 'nature sounds']
    },
    'y2k': {
      genres: ['pop', 'dance-pop', 'hip-hop', 'electronic'],
      energy: 0.8,
      valence: 0.7,
      danceability: 0.9,
      searchTerms: ['2000s pop', 'Britney Spears', 'NSYNC', 'early 2000s', 'pop punk']
    },
    // Additional vibes from lastfm_ontology.json
    'dreamy': {
      genres: ['dream-pop', 'shoegaze', 'indie-pop'],
      energy: 0.4,
      valence: 0.6,
      danceability: 0.4,
      searchTerms: ['dream pop', 'shoegaze', 'ethereal', 'Beach House', 'Cocteau Twins']
    },
    'moody': {
      genres: ['indie-rock', 'alternative', 'post-rock'],
      energy: 0.5,
      valence: 0.3,
      danceability: 0.4,
      searchTerms: ['indie rock', 'alternative', 'sadcore', 'moody indie']
    },
    'vintage': {
      genres: ['classic-rock', 'blues', 'soul'],
      energy: 0.6,
      valence: 0.5,
      danceability: 0.5,
      searchTerms: ['classic rock', 'retro', 'psychedelic rock', 'vintage soul']
    },
    'grunge': {
      genres: ['grunge', 'alternative-rock', 'punk'],
      energy: 0.8,
      valence: 0.3,
      danceability: 0.5,
      searchTerms: ['grunge', 'alternative rock', 'Nirvana', 'Pearl Jam', '90s grunge']
    },
    'romantic': {
      genres: ['r-n-b', 'soul', 'indie-pop'],
      energy: 0.4,
      valence: 0.8,
      danceability: 0.6,
      searchTerms: ['r&b', 'soul', 'love songs', 'romantic ballads']
    },
    'pastel': {
      genres: ['indie-pop', 'dream-pop', 'bedroom-pop'],
      energy: 0.3,
      valence: 0.7,
      danceability: 0.4,
      searchTerms: ['bedroom pop', 'indie pop', 'chillwave', 'Boy Pablo', 'Clairo']
    },
    'aesthetic': {
      genres: ['synth-pop', 'indie-pop', 'electronic'],
      energy: 0.5,
      valence: 0.6,
      danceability: 0.6,
      searchTerms: ['vaporwave', 'synthpop', 'aesthetic', 'neon', 'retro wave']
    }
  }

  // Default fallback
  const defaultParams = {
    genres: ['pop', 'indie'],
    energy: 0.5,
    valence: 0.5,
    danceability: 0.5,
    searchTerms: ['indie', 'alternative', 'popular music']
  }

  const lowerVibe = vibe.toLowerCase()
  
  // Find matching vibe or use default
  for (const [key, params] of Object.entries(vibeMap)) {
    if (lowerVibe.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerVibe)) {
      return params
    }
  }

  return defaultParams
}

// Generate curated playlist for a vibe using multiple search strategies
export async function generatePlaylistForVibe(vibe: string, limit: number = 25): Promise<any[]> {
  const params = mapVibeToSpotifyParams(vibe)
  
  // Strategy 1: Get recommendations using mapped parameters
  const recommendationTracks = await getRecommendations({
    seed_genres: params.genres,
    target_energy: params.energy,
    target_valence: params.valence,
    target_danceability: params.danceability,
    limit: Math.ceil(limit * 0.6) // 60% from recommendations
  })

  // Strategy 2: Search using vibe keywords
  const vibeSearchTracks = await searchTracks(`${vibe} aesthetic playlist`, Math.ceil(limit * 0.2))

  // Strategy 3: Search using searchTerms (artist/genre specific)
  const artistSearchTracks: any[] = []
  for (const searchTerm of params.searchTerms.slice(0, 2)) { // Limit to first 2 search terms
    const termTracks = await searchTracks(searchTerm, 3)
    artistSearchTracks.push(...termTracks)
  }

  // Combine all tracks
  const allTracks = [...recommendationTracks, ...vibeSearchTracks, ...artistSearchTracks]
  
  // Deduplicate by track ID
  const uniqueTracks = allTracks.filter((track, index, self) => 
    index === self.findIndex(t => t.id === track.id)
  )

  // Apply popularity filter (similar to Python implementation)
  const popularityThreshold = 30
  const qualityTracks = uniqueTracks.filter(track => {
    if (track.popularity && track.popularity < popularityThreshold) {
      console.log(`Low popularity, skipped: ${track.name} by ${track.artists[0]?.name} (popularity ${track.popularity})`)
      return false
    }
    return true
  })

  return qualityTracks.slice(0, limit)
}

// Create a Spotify playlist (requires user authentication)
export async function createSpotifyPlaylist(playlistName: string, trackUris: string[], isPublic: boolean = true): Promise<string | null> {
  // This would require OAuth implementation for user playlist creation
  // For now, we'll focus on track discovery and return the track URIs
  console.log(`Would create playlist "${playlistName}" with ${trackUris.length} tracks`)
  return null
}

// Search for a specific track on Spotify by name and artist
export async function searchSpotifyTrack(trackName: string, artistName: string): Promise<any | null> {
  const token = await getSpotifyAccessToken()
  if (!token) return null

  try {
    const query = encodeURIComponent(`track:"${trackName}" artist:"${artistName}"`)
    const response = await fetch(
      `${SPOTIFY_API_BASE}/search?q=${query}&type=track&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status}`)
    }

    const data = await response.json()
    const tracks = data.tracks?.items || []
    
    if (tracks.length > 0) {
      const track = tracks[0]
      return {
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        album: track.album?.name || 'Unknown Album',
        image: track.album?.images?.[0]?.url || null,
        popularity: track.popularity || 0
      }
    }
    
    return null
  } catch (error) {
    console.error(`Error searching track ${trackName} by ${artistName}:`, error)
    return null
  }
}

// Get album covers for moodboard using Last.fm + Spotify hybrid approach
export async function getAlbumCoversForVibe(vibe: string, limit: number = 4): Promise<any[]> {
  // Import Last.fm functions (dynamic import to avoid circular dependency)
  const { getTopTracksForTag, mapVibeToLastFmTags } = await import('./lastfm')
  
  const tags = mapVibeToLastFmTags(vibe)
  const albumCovers: any[] = []
  
  // Get tracks from multiple Last.fm tags
  for (const tag of tags.slice(0, 2)) { // Limit to first 2 tags
    try {
      const lastFmTracks = await getTopTracksForTag(tag, 5)
      
      // For each Last.fm track, find it on Spotify to get album artwork
      for (const lastFmTrack of lastFmTracks) {
        if (albumCovers.length >= limit) break
        
        const spotifyTrack = await searchSpotifyTrack(lastFmTrack.name, lastFmTrack.artist.name)
        
        if (spotifyTrack && spotifyTrack.image && spotifyTrack.popularity >= 30) {
          // Avoid duplicates by checking if we already have this album
          const isDuplicate = albumCovers.some(cover => 
            cover.album === spotifyTrack.album && cover.artist === spotifyTrack.artist
          )
          
          if (!isDuplicate) {
            albumCovers.push({
              id: spotifyTrack.id,
              album: spotifyTrack.album,
              artist: spotifyTrack.artist,
              image: spotifyTrack.image,
              popularity: spotifyTrack.popularity,
              source: 'lastfm+spotify'
            })
          }
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      if (albumCovers.length >= limit) break
    } catch (error) {
      console.error(`Error processing tag ${tag}:`, error)
    }
  }
  
  return albumCovers.slice(0, limit)
}