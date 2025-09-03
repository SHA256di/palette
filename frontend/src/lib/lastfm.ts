const LASTFM_API_KEY = process.env.LASTFM_API_KEY
const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/'

interface LastFmTrack {
  name: string
  artist: {
    name: string
  }
  url: string
  streamable: string
}

interface LastFmResponse {
  tracks?: {
    track: LastFmTrack[]
  }
}

// Get top tracks for a specific genre/tag from Last.fm
export async function getTopTracksForTag(tag: string, limit: number = 10): Promise<LastFmTrack[]> {
  if (!LASTFM_API_KEY) {
    console.error('Last.fm API key not found')
    return []
  }

  try {
    const params = new URLSearchParams({
      method: 'tag.gettoptracks',
      tag: tag,
      api_key: LASTFM_API_KEY,
      format: 'json',
      limit: limit.toString()
    })

    const response = await fetch(`${LASTFM_BASE_URL}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Last.fm request failed: ${response.status}`)
    }

    const data: LastFmResponse = await response.json()
    return data.tracks?.track || []
  } catch (error) {
    console.error(`Last.fm request failed for tag '${tag}':`, error)
    return []
  }
}

// Enhanced vibe to Last.fm tag mapping using your ontology
export function mapVibeToLastFmTags(vibe: string): string[] {
  const vibeToTagsMap: Record<string, string[]> = {
    'girlblogger': ['indie pop', 'dream pop', 'indie rock'],
    'indie sleaze': ['indie rock', 'alternative', 'garage rock'],
    'pink pilates princess': ['pop', 'dance pop', 'electropop'],
    'coastal grandmother': ['folk', 'acoustic', 'singer-songwriter'],
    'dark academia': ['classical', 'ambient', 'post-rock'],
    'cyberpunk': ['electronic', 'synthwave', 'industrial'],
    'cottagecore': ['folk', 'indie folk', 'acoustic'],
    'y2k': ['pop', 'dance pop', '2000s'],
    'dreamy': ['dream pop', 'shoegaze', 'ethereal wave'],
    'moody': ['indie rock', 'alternative', 'sadcore'],
    'vintage': ['classic rock', 'retro', 'psychedelic rock'],
    'grunge': ['grunge', 'alternative rock', 'post-grunge'],
    'romantic': ['r&b', 'soul', 'love songs'],
    'pastel': ['bedroom pop', 'indie pop', 'chillwave'],
    'aesthetic': ['vaporwave', 'synthpop', 'dream pop'],
    'punk': ['punk rock', 'hardcore punk', 'garage rock'],
    'boho': ['folk rock', 'psychedelic', 'chamber pop'],
    'glam': ['glam rock', 'art rock', 'electropop'],
    'urban': ['hip hop', 'trap', 'r&b'],
    'futuristic': ['synthwave', 'electronic', 'idm'],
    'noir': ['jazz', 'trip hop', 'dark ambient'],
    'retro': ['disco', 'funk', '80s'],
    'summer': ['surf rock', 'reggae', 'tropical house'],
    'autumn': ['indie folk', 'singer-songwriter', 'neo-folk'],
    'melancholy': ['sadcore', 'piano', 'ambient'],
    'chaotic': ['noise rock', 'experimental', 'math rock'],
    'ethereal': ['ethereal wave', 'ambient', 'shoegaze'],
    'colorful': ['pop rock', 'dance pop', 'indie pop'],
    'monochrome': ['post-punk', 'minimal', 'coldwave'],
    'sparkly': ['bubblegum pop', 'dance pop', 'hyperpop'],
    'industrial': ['industrial', 'ebm', 'industrial rock'],
    'cosmic': ['ambient', 'psychedelic', 'space rock', 'electronic'],
    'experimental': ['experimental', 'avant-garde', 'noise', 'post-rock'],
    'lofi': ['lo-fi', 'chillhop', 'downtempo', 'trip hop'],
    'folk': ['folk', 'folk rock', 'indie folk'],
    'chill': ['chillhop', 'downtempo', 'trip hop', 'lo-fi'],
    'quiet': ['lo-fi', 'instrumental', 'minimal', 'chillhop', 'downtempo']
  }

  // Default fallback
  const defaultTags = ['indie', 'alternative', 'pop']

  const lowerVibe = vibe.toLowerCase()
  
  // Find matching vibe or use default
  for (const [key, tags] of Object.entries(vibeToTagsMap)) {
    if (lowerVibe.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerVibe)) {
      return tags
    }
  }

  return defaultTags
}