'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AestheticImage {
  id: string
  url: string
  originalUrl: string
  smallUrl: string
  thumbUrl: string
  alt: string
  photographer: {
    name: string
    username: string
  }
  width: number
  height: number
  color: string
  processed: boolean
}

interface AestheticImagesProps {
  vibe: string
}

export default function AestheticImages({ vibe }: AestheticImagesProps) {
  const [images, setImages] = useState<AestheticImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [removeBackground, setRemoveBackground] = useState(false)

  const generateImages = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/aesthetic-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vibe, limit: 12, removeBackground }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate aesthetic images')
      }

      const data = await response.json()
      setImages(data.images)
    } catch (err) {
      setError('Failed to generate aesthetic images')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Aesthetic Images</h2>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={removeBackground}
              onChange={(e) => setRemoveBackground(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Remove Background</span>
          </label>
          <button
            onClick={generateImages}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Images'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Color indicator */}
                  <div 
                    className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: image.color }}
                  />
                  
                  {/* Processing indicator */}
                  {image.processed && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Transparent
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                  <div className="text-white">
                    <p className="text-xs font-medium">{image.photographer.name}</p>
                    <p className="text-xs opacity-75">@{image.photographer.username}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">
                        {image.width} × {image.height}
                      </span>
                      <a
                        href={`https://unsplash.com/@${image.photographer.username}?utm_source=palette&utm_medium=referral`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline hover:text-orange-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Unsplash
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              {images.length} aesthetic images for "{vibe}" vibe
              {removeBackground && ' with background processing'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Photos by talented photographers on{' '}
              <a 
                href="https://unsplash.com/?utm_source=palette&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-orange-600"
              >
                Unsplash
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}