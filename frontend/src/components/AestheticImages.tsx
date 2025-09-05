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
  blogger?: {
    name: string
    url: string
  }
  tags?: string[]
  timestamp?: number
  width: number
  height: number
  processed: boolean
  source: string
}

interface AestheticImagesProps {
  vibe: string
}

export default function AestheticImages({ vibe }: AestheticImagesProps) {
  const [images, setImages] = useState<AestheticImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Background removal not available with Unsplash

  const generateImages = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/unsplash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: vibe, limit: 24 }),
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
          <button
            onClick={generateImages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Get from Unsplash'}
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
                  
                  {/* Source indicator */}
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Unsplash
                  </div>
                  
                  {/* Processing indicator */}
                  {image.processed && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Transparent
                    </div>
                  )}
                  
                  {/* Tags indicator */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      #{image.tags[0]}
                    </div>
                  )}
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                  <div className="text-white">
                    <p className="text-xs font-medium">{image.blogger?.name || 'Photographer'}</p>
                    <p className="text-xs opacity-75">
                      {image.tags && image.tags.length > 1 && `#${image.tags.slice(0, 2).join(' #')}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">
                        {image.width} × {image.height}
                      </span>
                      <a
                        href={image.blogger?.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs underline hover:text-blue-300"
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
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Beautiful photos from{' '}
              <a 
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Unsplash
              </a>{' '}
              photographers
            </p>
          </div>
        </div>
      )}
    </div>
  )
}