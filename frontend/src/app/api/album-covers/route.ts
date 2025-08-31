import { NextRequest, NextResponse } from 'next/server'
import { getAlbumCoversForVibe } from '@/lib/spotify'

export async function POST(request: NextRequest) {
  try {
    const { vibe, limit = 4 } = await request.json()

    if (!vibe) {
      return NextResponse.json({ error: 'Vibe parameter is required' }, { status: 400 })
    }

    const albumCovers = await getAlbumCoversForVibe(vibe, limit)
    
    return NextResponse.json({ 
      albumCovers,
      vibe,
      total: albumCovers.length
    })
  } catch (error) {
    console.error('Error generating album covers:', error)
    return NextResponse.json(
      { error: 'Failed to generate album covers' },
      { status: 500 }
    )
  }
}