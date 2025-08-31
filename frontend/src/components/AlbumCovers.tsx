'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AlbumCover {
  id: string
  album: string
  artist: string
  image: string
  popularity: number
  source: string
}

interface AlbumCoversProps {
  vibe: string
}

export default function AlbumCovers({ vibe }: AlbumCoversProps) {
  const [albumCovers, setAlbumCovers] = useState<AlbumCover[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateAlbumCovers = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/album-covers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, limit: 4 }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate album covers')
      }

      const data = await response.json()
      setAlbumCovers(data.albumCovers)
    } catch (err) {
      setError('Failed to generate album covers')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Album Covers</h2>
        <button
          onClick={generateAlbumCovers}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Covers'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {albumCovers.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albumCovers.map((cover) => (
            <div key={cover.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={cover.image}
                  alt={`${cover.album} by ${cover.artist}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {cover.album}
                </h3>
                <p className="text-xs text-gray-600 truncate">
                  {cover.artist}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {cover.popularity}% popular
                  </span>
                  <span className="text-xs text-purple-600 font-medium">
                    Last.fm
                  </span>
                </div>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <p className="text-sm font-semibold">{cover.album}</p>
                  <p className="text-xs opacity-90">{cover.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {albumCovers.length > 0 && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            {albumCovers.length} aesthetic album covers for "{vibe}" vibe
          </p>
        </div>
      )}
    </div>
  )
}