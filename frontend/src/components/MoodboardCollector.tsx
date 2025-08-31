'use client'

import { useState, useEffect } from 'react'
import MoodboardGenerator from './MoodboardGenerator'

interface MoodboardCollectorProps {
  vibe: string
}

export default function MoodboardCollector({ vibe }: MoodboardCollectorProps) {
  const [films, setFilms] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [aestheticImages, setAestheticImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const collectAllContent = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Fetch all content types in parallel
      const [filmsResponse, albumsResponse, imagesResponse] = await Promise.all([
        fetch('/api/films', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 6 })
        }),
        fetch('/api/album-covers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 4 })
        }),
        fetch('/api/aesthetic-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 8, removeBackground: false })
        })
      ])

      const [filmsData, albumsData, imagesData] = await Promise.all([
        filmsResponse.ok ? filmsResponse.json() : { films: [] },
        albumsResponse.ok ? albumsResponse.json() : { albumCovers: [] },
        imagesResponse.ok ? imagesResponse.json() : { images: [] }
      ])

      setFilms(filmsData.films || [])
      setAlbums(albumsData.albumCovers || [])
      setAestheticImages(imagesData.images || [])
      
    } catch (err) {
      setError('Failed to collect content for moodboard')
      console.error('Error collecting content:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalContent = films.length + albums.length + aestheticImages.length

  return (
    <div className="space-y-6">
      {/* Content Collection */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Collection</h3>
            <p className="text-sm text-gray-600">
              Gather all visual elements for your moodboard
            </p>
          </div>
          
          <button
            onClick={collectAllContent}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Collecting...' : 'Collect All Content'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {totalContent > 0 && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{films.length}</div>
              <div className="text-sm text-gray-600">Films</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{albums.length}</div>
              <div className="text-sm text-gray-600">Albums</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{aestheticImages.length}</div>
              <div className="text-sm text-gray-600">Images</div>
            </div>
          </div>
        )}
      </div>

      {/* Moodboard Generator */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <MoodboardGenerator
          vibe={vibe}
          films={films}
          albums={albums}
          aestheticImages={aestheticImages}
        />
      </div>

      {/* Content Preview */}
      {totalContent > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Collected Content Preview
          </h3>
          
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {films.slice(0, 4).map((film, index) => (
              <div key={`film-${index}`} className="aspect-square relative">
                <img
                  src={film.poster_path ? `https://image.tmdb.org/t/p/w200${film.poster_path}` : ''}
                  alt={film.title}
                  className="w-full h-full object-cover rounded border-2 border-blue-200"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                  F
                </div>
              </div>
            ))}
            
            {albums.slice(0, 2).map((album, index) => (
              <div key={`album-${index}`} className="aspect-square relative">
                <img
                  src={album.image}
                  alt={album.album}
                  className="w-full h-full object-cover rounded border-2 border-green-200"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
                  A
                </div>
              </div>
            ))}
            
            {aestheticImages.slice(0, 6).map((image, index) => (
              <div key={`image-${index}`} className="aspect-square relative">
                <img
                  src={image.thumbUrl}
                  alt={image.alt}
                  className="w-full h-full object-cover rounded border-2 border-orange-200"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">
                  I
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            F = Films, A = Albums, I = Images • Total: {totalContent} elements
          </div>
        </div>
      )}
    </div>
  )
}