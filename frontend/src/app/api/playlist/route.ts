import { NextRequest, NextResponse } from 'next/server'
import { generatePlaylistForVibe, searchTracks } from '../../../lib/spotify'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 25 } = await request.json()

    if (!vibe) {
      return NextResponse.json(
        { error: 'Vibe parameter is required' },
        { status: 400 }
      )
    }

    // Generate playlist based on the vibe
    const tracks = await generatePlaylistForVibe(vibe, limit)

    if (tracks.length === 0) {
      return NextResponse.json(
        { error: 'No tracks found for this vibe' },
        { status: 404 }
      )
    }

    // Format response with essential track information
    const playlist = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => ({
        id: artist.id,
        name: artist.name
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images
      },
      external_urls: track.external_urls,
      preview_url: track.preview_url,
      duration_ms: track.duration_ms,
      popularity: track.popularity
    }))

    return NextResponse.json({
      vibe,
      tracks: playlist,
      total: playlist.length,
      generated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating playlist:', error)
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
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const tracks = await searchTracks(query, limit)

    const results = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => ({
        id: artist.id,
        name: artist.name
      })),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images
      },
      external_urls: track.external_urls,
      preview_url: track.preview_url
    }))

    return NextResponse.json({
      query,
      tracks: results,
      total: results.length
    })

  } catch (error) {
    console.error('Error searching tracks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}