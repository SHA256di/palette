import { NextRequest, NextResponse } from 'next/server'
import { generateMoviesForVibe, searchMovies } from '../../../lib/tmdb'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 8 } = await request.json()

    if (!vibe) {
      return NextResponse.json(
        { error: 'Vibe parameter is required' },
        { status: 400 }
      )
    }

    // Generate movies based on the vibe
    const movies = await generateMoviesForVibe(vibe, limit)

    if (movies.length === 0) {
      return NextResponse.json(
        { error: 'No movies found for this vibe' },
        { status: 404 }
      )
    }

    // Format response with essential movie information
    const filmReferences = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      poster_url: movie.poster_url,
      backdrop_url: movie.backdrop_url,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids
    }))

    return NextResponse.json({
      vibe,
      films: filmReferences,
      total: filmReferences.length,
      generated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating film references:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const movies = await searchMovies(query, limit)

    const results = movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      release_date: movie.release_date,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      vote_average: movie.vote_average
    }))

    return NextResponse.json({
      query,
      films: results,
      total: results.length
    })

  } catch (error) {
    console.error('Error searching films:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}