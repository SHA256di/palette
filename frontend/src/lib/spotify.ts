import { filterNSFWContent, filterLowQuality } from './aesthetic-mapping'

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

// Enhanced playlist generation using aesthetic API mappings
export async function generatePlaylistForVibe(
  vibe: string, 
  limit: number = 25, 
  apiTags?: any // Enhanced API tags from aesthetic analysis
): Promise<any[]> {
  console.log(`🎵 Generating playlist for vibe: ${vibe}`)
  
  // Use enhanced API mappings if available, otherwise fall back to legacy mapping
  let searchParams
  if (apiTags?.spotify) {
    searchParams = {
      genres: apiTags.spotify.genres.slice(0, 5), // Spotify recommendations API limit
      searchTerms: [...apiTags.spotify.artists.slice(0, 3), ...apiTags.spotify.search_terms.slice(0, 2)],
      energy: apiTags.spotify.audio_features.energy,
      valence: apiTags.spotify.audio_features.valence,
      danceability: apiTags.spotify.audio_features.danceability,
      acousticness: apiTags.spotify.audio_features.acousticness
    }
    console.log(`✨ Using enhanced Spotify mapping:`, {
      genres: searchParams.genres,
      features: {
        energy: searchParams.energy,
        valence: searchParams.valence,
        danceability: searchParams.danceability
      }
    })
  } else {
    searchParams = mapVibeToSpotifyParams(vibe)
    console.log(`📝 Using legacy mapping for: ${vibe}`)
  }
  
  const allTracks: any[] = []
  
  // Strategy 1: Enhanced recommendations with multiple seed combinations
  if (searchParams.genres?.length > 0) {
    // Split genres into combinations of up to 5 (Spotify limit)
    const genreChunks = []
    for (let i = 0; i < searchParams.genres.length; i += 3) {
      genreChunks.push(searchParams.genres.slice(i, i + 3))
    }
    
    for (const genreChunk of genreChunks.slice(0, 2)) {
      try {
        const recommendationTracks = await getRecommendations({
          seed_genres: genreChunk,
          target_energy: searchParams.energy,
          target_valence: searchParams.valence,
          target_danceability: searchParams.danceability,
          limit: Math.ceil(limit * 0.4) // 40% from recommendations
        })
        allTracks.push(...recommendationTracks)
        console.log(`🎯 Got ${recommendationTracks.length} tracks from genres: ${genreChunk.join(', ')}`)
      } catch (error) {
        console.log(`⚠️ Recommendations failed for genres: ${genreChunk.join(', ')}`)
      }
    }
  }

  // Strategy 2: Direct vibe search
  try {
    const vibeSearchTracks = await searchTracks(`${vibe} playlist music`, Math.ceil(limit * 0.2))
    allTracks.push(...vibeSearchTracks)
    console.log(`🔍 Got ${vibeSearchTracks.length} tracks from vibe search`)
  } catch (error) {
    console.log(`⚠️ Vibe search failed for: ${vibe}`)
  }

  // Strategy 3: Artist and keyword-based searches
  if (searchParams.searchTerms?.length > 0) {
    for (const searchTerm of searchParams.searchTerms.slice(0, 4)) {
      try {
        const termTracks = await searchTracks(searchTerm, 5)
        allTracks.push(...termTracks)
        console.log(`👤 Got ${termTracks.length} tracks from search: ${searchTerm}`)
      } catch (error) {
        console.log(`⚠️ Search failed for term: ${searchTerm}`)
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log(`🔍 Found ${allTracks.length} tracks from all search strategies`)
  
  // Deduplicate by track ID
  const uniqueTracks = allTracks.filter((track, index, self) => 
    index === self.findIndex(t => t.id === track.id)
  )
  
  console.log(`🔄 After deduplication: ${uniqueTracks.length} unique tracks`)

  // Enhanced quality filtering
  const qualityTracks = uniqueTracks.filter(track => {
    // Use enhanced quality filter
    if (!filterLowQuality(track, 'spotify')) {
      console.log(`❌ Low quality filtered: ${track.name} by ${track.artists?.[0]?.name}`)
      return false
    }
    
    // Apply NSFW content filtering
    const trackText = `${track.name} ${track.artists?.[0]?.name || ''} ${track.album?.name || ''}`.toLowerCase()
    if (!filterNSFWContent([trackText])) {
      console.log(`❌ NSFW filtered: ${track.name}`)
      return false
    }
    
    // Enhanced popularity threshold based on aesthetic
    const minPopularity = apiTags?.spotify ? 25 : 30 // Slightly lower for niche aesthetics
    if (track.popularity && track.popularity < minPopularity) {
      console.log(`❌ Low popularity filtered: ${track.name} (${track.popularity})`)
      return false
    }
    
    return true
  })

  console.log(`✅ After quality filtering: ${qualityTracks.length} high-quality tracks`)

  // Enhanced sorting with aesthetic-specific scoring
  qualityTracks.sort((a, b) => {
    // Multi-factor scoring: popularity (40%), audio features match (30%), artist variety (30%)
    const getAudioFeatureScore = (track: any) => {
      if (!track.audio_features) return 0.5 // Default if no features available
      
      const energyMatch = 1 - Math.abs(track.audio_features.energy - searchParams.energy)
      const valenceMatch = 1 - Math.abs(track.audio_features.valence - searchParams.valence)
      const danceMatch = 1 - Math.abs(track.audio_features.danceability - searchParams.danceability)
      
      return (energyMatch + valenceMatch + danceMatch) / 3
    }
    
    const getArtistVarietyScore = (track: any, allTracks: any[]) => {
      const artistName = track.artists?.[0]?.name
      if (!artistName) return 0.5
      
      const sameArtistCount = allTracks.filter(t => 
        t.artists?.[0]?.name === artistName
      ).length
      
      return 1 / Math.sqrt(sameArtistCount) // Prefer artists with fewer tracks
    }
    
    const scoreA = (
      (a.popularity || 0) / 100 * 0.4 +
      getAudioFeatureScore(a) * 0.3 +
      getArtistVarietyScore(a, qualityTracks) * 0.3
    )
    
    const scoreB = (
      (b.popularity || 0) / 100 * 0.4 +
      getAudioFeatureScore(b) * 0.3 +
      getArtistVarietyScore(b, qualityTracks) * 0.3
    )
    
    return scoreB - scoreA
  })

  const finalResults = qualityTracks.slice(0, limit)
  console.log(`🎯 Final playlist: ${finalResults.length} curated tracks for ${vibe}`)
  
  return finalResults
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

// Enhanced album covers for moodboard using enhanced aesthetic mappings
export async function getAlbumCoversForVibe(
  vibe: string, 
  limit: number = 4, 
  apiTags?: any // Enhanced API tags from aesthetic analysis
): Promise<any[]> {
  console.log(`💿 Getting album covers for vibe: ${vibe}`)
  
  let searchStrategies: string[] = []
  
  // Use enhanced mappings if available
  if (apiTags?.spotify) {
    searchStrategies = [
      ...apiTags.spotify.artists.slice(0, 3),
      ...apiTags.spotify.search_terms.slice(0, 2),
      vibe
    ]
    console.log(`✨ Using enhanced search strategies:`, searchStrategies.slice(0, 3))
  } else {
    // Import Last.fm functions for fallback (dynamic import to avoid circular dependency)
    try {
      const { getTopTracksForTag, mapVibeToLastFmTags } = await import('./lastfm')
      const lastfmTags = mapVibeToLastFmTags(vibe)
      searchStrategies = [...lastfmTags.slice(0, 2), vibe]
      console.log(`📝 Using Last.fm tags:`, lastfmTags.slice(0, 2))
    } catch (error) {
      console.log(`⚠️ Last.fm import failed, using direct search`)
      searchStrategies = [vibe]
    }
  }
  
  const albumCovers: any[] = []
  
  // Strategy 1: Direct artist/genre searches on Spotify
  for (const searchTerm of searchStrategies.slice(0, 4)) {
    try {
      const tracks = await searchTracks(searchTerm, 8)
      
      for (const track of tracks) {
        if (albumCovers.length >= limit * 2) break // Get more candidates than needed
        
        // Quality checks
        if (!track.album?.images?.[0]?.url) continue
        if (!filterLowQuality(track, 'spotify')) continue
        
        const trackText = `${track.name} ${track.artists?.[0]?.name || ''} ${track.album?.name || ''}`.toLowerCase()
        if (!filterNSFWContent([trackText])) continue
        
        // Avoid album duplicates
        const isDuplicate = albumCovers.some(cover => 
          cover.album === track.album?.name && cover.artist === track.artists?.[0]?.name
        )
        
        if (!isDuplicate) {
          albumCovers.push({
            id: track.id,
            album: track.album?.name || 'Unknown Album',
            artist: track.artists?.[0]?.name || 'Unknown Artist',
            image: track.album?.images?.[0]?.url,
            popularity: track.popularity || 0,
            release_date: track.album?.release_date,
            total_tracks: track.album?.total_tracks,
            source: 'spotify-direct'
          })
          console.log(`💿 Found album: ${track.album?.name} by ${track.artists?.[0]?.name}`)
        }
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 150))
    } catch (error) {
      console.error(`Error searching for ${searchTerm}:`, error)
    }
  }
  
  console.log(`🔍 Found ${albumCovers.length} album covers from all searches`)
  
  // Fallback: Last.fm + Spotify hybrid approach if not enough results
  if (albumCovers.length < limit) {
    try {
      const { getTopTracksForTag, mapVibeToLastFmTags } = await import('./lastfm')
      const lastfmTags = mapVibeToLastFmTags(vibe)
      
      for (const tag of lastfmTags.slice(0, 2)) {
        if (albumCovers.length >= limit) break
        
        try {
          const lastFmTracks = await getTopTracksForTag(tag, 6)
          
          for (const lastFmTrack of lastFmTracks) {
            if (albumCovers.length >= limit) break
            
            const spotifyTrack = await searchSpotifyTrack(lastFmTrack.name, lastFmTrack.artist.name)
            
            if (spotifyTrack && spotifyTrack.image) {
              const trackText = `${spotifyTrack.name} ${spotifyTrack.artist} ${spotifyTrack.album}`.toLowerCase()
              if (!filterNSFWContent([trackText])) continue
              
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
                console.log(`💿 Last.fm found: ${spotifyTrack.album} by ${spotifyTrack.artist}`)
              }
            }
            
            await new Promise(resolve => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.error(`Error processing Last.fm tag ${tag}:`, error)
        }
      }
    } catch (error) {
      console.log(`⚠️ Last.fm fallback failed:`, error)
    }
  }
  
  // Sort by popularity and aesthetic relevance
  albumCovers.sort((a, b) => {
    // Prefer albums with higher popularity and more recent releases
    const aScore = (a.popularity || 0) * 0.7 + (a.source === 'spotify-direct' ? 0.3 : 0)
    const bScore = (b.popularity || 0) * 0.7 + (b.source === 'spotify-direct' ? 0.3 : 0)
    return bScore - aScore
  })
  
  const finalResults = albumCovers.slice(0, limit)
  console.log(`🎯 Final album covers: ${finalResults.length} curated covers for ${vibe}`)
  
  return finalResults
}