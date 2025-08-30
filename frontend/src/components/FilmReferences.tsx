'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Film {
  id: number
  title: string
  release_date: string
  overview: string
  poster_url: string | null
  backdrop_url: string | null
  vote_average: number
  genre_ids: number[]
}

interface FilmResponse {
  vibe: string
  films: Film[]
  total: number
  generated_at: string
}

interface FilmReferencesProps {
  vibe: string
  onFilmsGenerated?: (films: FilmResponse) => void
}

export default function FilmReferences({ vibe, onFilmsGenerated }: FilmReferencesProps) {
  const [films, setFilms] = useState<FilmResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateFilms = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, limit: 8 })
      })

      if (!response.ok) {
        throw new Error('Failed to generate film references')
      }

      const data: FilmResponse = await response.json()
      setFilms(data)
      onFilmsGenerated?.(data)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Film References for "{vibe}"
        </h3>
        <button
          onClick={generateFilms}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Films'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {films && (
        <div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Found {films.total} films matching the "{films.vibe}" vibe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {films.films.map((film) => (
              <div
                key={film.id}
                className="group cursor-pointer transition-transform hover:scale-105"
              >
                <div className="relative aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden mb-2">
                  {film.poster_url ? (
                    <Image
                      src={film.poster_url}
                      alt={film.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Rating badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    ⭐ {film.vote_average.toFixed(1)}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-900 truncate mb-1">
                    {film.title}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {formatYear(film.release_date)}
                  </p>
                </div>

                {/* Tooltip on hover */}
                <div className="hidden group-hover:block absolute z-10 w-64 p-3 mt-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg">
                  <p className="font-medium mb-1">{film.title} ({formatYear(film.release_date)})</p>
                  <p>{film.overview.slice(0, 120)}...</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              Curated from TMDb based on genre matching and cultural relevance
            </p>
          </div>
        </div>
      )}
    </div>
  )
}