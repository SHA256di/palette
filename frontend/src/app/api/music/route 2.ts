import { NextRequest, NextResponse } from 'next/server'
import { generatePlaylistForVibe } from '@/lib/spotify'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 20 } = await request.json()

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 })
    }

    const tracks = await generatePlaylistForVibe(vibe, limit)
    
    // Format tracks for frontend display
    const formattedTracks = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name || 'Unknown Artist',
      album: track.album?.name || 'Unknown Album',
      image: track.album?.images?.[0]?.url || null,
      preview_url: track.preview_url,
      external_url: track.external_urls?.spotify,
      popularity: track.popularity || 0,
      duration_ms: track.duration_ms || 0
    }))

    return NextResponse.json({ 
      tracks: formattedTracks,
      vibe,
      total: formattedTracks.length
    })
  } catch (error) {
    console.error('Error generating music:', error)
    return NextResponse.json(
      { error: 'Failed to generate music recommendations' },
      { status: 500 }
    )
  }
}