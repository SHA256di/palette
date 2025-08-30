'use client'

import { useState } from 'react'

interface Track {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: {
    id: string
    name: string
    images: { url: string; height: number; width: number }[]
  }
  external_urls: { spotify: string }
  preview_url: string | null
  duration_ms: number
  popularity: number
}

interface PlaylistResponse {
  vibe: string
  tracks: Track[]
  total: number
  generated_at: string
}

interface SpotifyPlaylistProps {
  vibe: string
  onPlaylistGenerated?: (playlist: PlaylistResponse) => void
}

export default function SpotifyPlaylist({ vibe, onPlaylistGenerated }: SpotifyPlaylistProps) {
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePlaylist = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, limit: 25 })
      })

      if (!response.ok) {
        throw new Error('Failed to generate playlist')
      }

      const data: PlaylistResponse = await response.json()
      setPlaylist(data)
      onPlaylistGenerated?.(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Music for "{vibe}"
        </h3>
        <button
          onClick={generatePlaylist}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Playlist'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {playlist && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Generated {playlist.total} tracks for the "{playlist.vibe}" vibe
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="text-sm text-gray-400 w-6">
                  {index + 1}
                </div>

                {track.album.images[0] && (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-12 h-12 rounded-md"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {track.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {formatDuration(track.duration_ms)}
                  </span>
                  
                  {track.preview_url && (
                    <audio
                      controls
                      preload="none"
                      className="h-8"
                      style={{ width: '120px' }}
                    >
                      <source src={track.preview_url} type="audio/mpeg" />
                    </audio>
                  )}

                  <a
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <a
              href={`https://open.spotify.com/search/${encodeURIComponent(vibe + ' playlist')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              <span>Create playlist in Spotify</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}