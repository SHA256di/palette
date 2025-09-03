import { filterNSFWContent, filterLowQuality, AESTHETIC_API_MAPPINGS } from './aesthetic-mapping'

const TMDB_API_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// Get TMDb API key from environment variables
function getTMDbApiKey(): string | null {
  return process.env.TMDB_API_KEY || null
}

// Search for movies based on query
export async function searchMovies(query: string, limit: number = 20): Promise<any[]> {
  const apiKey = getTMDbApiKey()
  if (!apiKey) {
    console.error('TMDb API key not found in environment variables')
    return []
  }

  try {
    const searchQuery = encodeURIComponent(query)
    const response = await fetch(
      `${TMDB_API_BASE}/search/movie?api_key=${apiKey}&query=${searchQuery}&page=1`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`TMDb search request failed: ${response.status}`)
    }

    const data = await response.json()
    return (data.results || []).slice(0, limit)
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

// Get movies by genre
export async function getMoviesByGenre(genreIds: number[], limit: number = 20): Promise<any[]> {
  const apiKey = getTMDbApiKey()
  if (!apiKey) return []

  try {
    const genreString = genreIds.join(',')
    const response = await fetch(
      `${TMDB_API_BASE}/discover/movie?api_key=${apiKey}&with_genres=${genreString}&sort_by=popularity.desc&page=1`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`TMDb genre request failed: ${response.status}`)
    }

    const data = await response.json()
    return (data.results || []).slice(0, limit)
  } catch (error) {
    console.error('Error getting movies by genre:', error)
    return []
  }
}

// Get movie genres list
export async function getMovieGenres(): Promise<any[]> {
  const apiKey = getTMDbApiKey()
  if (!apiKey) return []

  try {
    const response = await fetch(
      `${TMDB_API_BASE}/genre/movie/list?api_key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`TMDb genres request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.genres || []
  } catch (error) {
    console.error('Error getting movie genres:', error)
    return []
  }
}

// Map vibe/aesthetic to TMDb genre IDs and search terms
export function mapVibeToTMDbParams(vibe: string): {
  genres: number[]
  searchTerms: string[]
  yearRange?: { min: number; max: number }
} {
  const vibeMap: Record<string, any> = {
    'girlblogger': {
      genres: [18, 35, 10749], // Drama, Comedy, Romance
      searchTerms: ['Sofia Coppola', 'indie girl', 'tumblr aesthetic', 'teenage dream', 'female driven'],
      yearRange: { min: 2005, max: 2018 }
    },
    'indie sleaze': {
      genres: [18, 80, 53], // Drama, Crime, Thriller
      searchTerms: ['indie', 'underground', 'art house'],
      yearRange: { min: 2000, max: 2012 }
    },
    'pink pilates princess': {
      genres: [35, 10749, 10402], // Comedy, Romance, Music
      searchTerms: ['romantic comedy', 'fashion', 'wellness'],
      yearRange: { min: 2010, max: 2024 }
    },
    'coastal grandmother': {
      genres: [18, 10749, 10751], // Drama, Romance, Family
      searchTerms: ['family drama', 'seaside', 'mature romance'],
      yearRange: { min: 1990, max: 2020 }
    },
    'dark academia': {
      genres: [18, 9648, 53], // Drama, Mystery, Thriller
      searchTerms: ['university', 'gothic', 'literary adaptation'],
      yearRange: { min: 1980, max: 2024 }
    },
    'cottagecore': {
      genres: [18, 10749, 10751], // Drama, Romance, Family
      searchTerms: ['pastoral', 'countryside', 'period drama'],
      yearRange: { min: 1990, max: 2024 }
    },
    'y2k': {
      genres: [28, 878, 35], // Action, Sci-Fi, Comedy
      searchTerms: ['tech thriller', 'millennium', 'cyber'],
      yearRange: { min: 1995, max: 2005 }
    },
    'cyberpunk': {
      genres: [878, 28, 53], // Sci-Fi, Action, Thriller
      searchTerms: ['cyberpunk', 'dystopian', 'tech noir'],
      yearRange: { min: 1980, max: 2024 }
    }
  }

  // Default fallback
  const defaultParams = {
    genres: [18, 35], // Drama, Comedy
    searchTerms: ['indie', 'contemporary'],
    yearRange: { min: 2000, max: 2024 }
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

// Enhanced movie generation using aesthetic API mappings
export async function generateMoviesForVibe(
  vibe: string, 
  limit: number = 8,
  apiTags?: any // Enhanced API tags from aesthetic analysis
): Promise<any[]> {
  console.log(`🎬 Generating movies for vibe: ${vibe}`)
  
  // Use enhanced API mappings if available, otherwise fall back to legacy mapping
  let searchParams
  console.log('🔎 Checking apiTags.tmdb:', !!apiTags?.tmdb, apiTags?.tmdb)
  if (apiTags?.tmdb) {
    searchParams = {
      genres: apiTags.tmdb.genres,
      searchTerms: apiTags.tmdb.keywords,
      yearRange: apiTags.tmdb.year_ranges?.[0],
      voteThreshold: apiTags.tmdb.vote_threshold
    }
    console.log(`✨ Using enhanced TMDb mapping:`, searchParams)
  } else {
    searchParams = mapVibeToTMDbParams(vibe)
    console.log(`📝 Using legacy mapping for: ${vibe}`)
  }
  
  // Multi-strategy search approach
  const searchPromises = []
  
  // Strategy 1: Genre-based discovery
  if (searchParams.genres?.length > 0) {
    searchPromises.push(getMoviesByGenre(searchParams.genres, limit * 2))
  }
  
  // Strategy 2: Keyword searches
  if (searchParams.searchTerms?.length > 0) {
    searchParams.searchTerms.slice(0, 3).forEach((term: string) => {
      searchPromises.push(searchMovies(term, 8))
    })
  }
  
  // Strategy 3: Direct vibe search as fallback
  searchPromises.push(searchMovies(vibe, 6))
  
  const searchResults = await Promise.all(searchPromises)
  const allMovies = searchResults.flat()
  
  console.log(`🔍 Found ${allMovies.length} movies from all search strategies`)
  
  // Deduplicate by movie ID
  const uniqueMovies = allMovies.filter((movie, index, self) => 
    index === self.findIndex(m => m.id === movie.id)
  )
  
  console.log(`🔄 After deduplication: ${uniqueMovies.length} unique movies`)

  // Enhanced quality filtering
  const qualityFiltered = uniqueMovies.filter(movie => {
    // Use enhanced quality filter
    if (!filterLowQuality(movie, 'tmdb')) return false
    
    // Apply NSFW content filtering
    const movieText = `${movie.title} ${movie.overview || ''} ${movie.tagline || ''}`.toLowerCase()
    if (!filterNSFWContent([movieText])) return false
    
    // Custom vote threshold based on aesthetic
    const minVoteAverage = (searchParams as any).voteThreshold || 5.0
    if (movie.vote_average < minVoteAverage) return false
    
    return true
  })

  console.log(`✅ After quality filtering: ${qualityFiltered.length} high-quality movies`)

  // Apply year range filtering if specified
  let filteredMovies = qualityFiltered
  if (searchParams.yearRange) {
    filteredMovies = qualityFiltered.filter(movie => {
      if (!movie.release_date) return false
      const year = new Date(movie.release_date).getFullYear()
      return year >= searchParams.yearRange.min && year <= searchParams.yearRange.max
    })
    console.log(`📅 After year filtering (${searchParams.yearRange.min}-${searchParams.yearRange.max}): ${filteredMovies.length} movies`)
  }

  // Enhanced scoring algorithm
  filteredMovies.sort((a, b) => {
    // Weighted scoring: popularity (20%), vote average (40%), vote count (20%), recency (20%)
    const currentYear = new Date().getFullYear()
    const getRecencyScore = (movie: any) => {
      const releaseYear = new Date(movie.release_date || '2000').getFullYear()
      const yearDiff = currentYear - releaseYear
      return Math.max(0, 1 - (yearDiff / 50)) // Decay over 50 years
    }
    
    const scoreA = (
      (Math.log10(a.popularity || 1) / 3) * 0.2 +
      (a.vote_average / 10) * 0.4 +
      (Math.log10(a.vote_count || 1) / 5) * 0.2 +
      getRecencyScore(a) * 0.2
    )
    
    const scoreB = (
      (Math.log10(b.popularity || 1) / 3) * 0.2 +
      (b.vote_average / 10) * 0.4 +
      (Math.log10(b.vote_count || 1) / 5) * 0.2 +
      getRecencyScore(b) * 0.2
    )
    
    return scoreB - scoreA
  })

  // Format results with full image URLs and additional metadata
  const finalResults = filteredMovies.slice(0, limit).map(movie => ({
    ...movie,
    poster_url: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
    backdrop_url: movie.backdrop_path ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` : null,
    score: {
      popularity: movie.popularity,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count
    }
  }))

  console.log(`🎯 Final results: ${finalResults.length} curated movies for ${vibe}`)
  return finalResults
}