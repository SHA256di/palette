'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Track {
  id: string
  name: string
  artist: string
  album: string
  image: string | null
  preview_url: string | null
  external_url: string
  popularity: number
  duration_ms: number
}

interface MusicPlaylistProps {
  vibe: string
}

export default function MusicPlaylist({ vibe }: MusicPlaylistProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateMusic = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, limit: 16 }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate music')
      }

      const data = await response.json()
      setTracks(data.tracks)
    } catch (err) {
      setError('Failed to generate music recommendations')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Music Playlist</h2>
        <button
          onClick={generateMusic}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Music'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div key={track.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex-shrink-0">
                {track.image ? (
                  <Image
                    src={track.image}
                    alt={`${track.album} cover`}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </div>
              
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{track.name}</h3>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                <p className="text-xs text-gray-500 truncate">{track.album}</p>
              </div>
              
              <div className="flex-shrink-0 text-right">
                <div className="text-sm text-gray-500">
                  {formatDuration(track.duration_ms)}
                </div>
                <div className="text-xs text-gray-400">
                  {track.popularity}% popular
                </div>
              </div>
              
              <div className="flex-shrink-0 flex space-x-2">
                {track.preview_url && (
                  <button
                    onClick={() => {
                      const audio = new Audio(track.preview_url!)
                      audio.play()
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Play preview"
                  >
                    ▶
                  </button>
                )}
                
                <a
                  href={track.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Open in Spotify"
                >
                  🎵
                </a>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              {tracks.length} tracks generated for "{vibe}" vibe
            </p>
          </div>
        </div>
      )}
    </div>
  )
}