'use client'

import React, { useMemo } from 'react'
import { CollageLayoutProps, LayoutSlot } from '../types/layouts'

export default function CollageLayout({
  vibe,
  originalImage,
  originalImageName,
  films = [],
  albums = [],
  aestheticImages = [],
  quotes = [],
  slots: providedSlots,
  heroSlot: providedHeroSlot
}: CollageLayoutProps) {

  const { heroSlot, collageSlots } = useMemo(() => {
    if (providedSlots && providedHeroSlot) {
      return { heroSlot: providedHeroSlot, collageSlots: providedSlots }
    }

    // Hero slot is always the original product image
    const hero: LayoutSlot | undefined = originalImage ? {
      type: 'product',
      source: originalImage,
      title: originalImageName || 'your product',
      originalImage: true
    } : undefined

    // Create content pool for collage
    const allContent = [
      ...aestheticImages.map(img => ({ type: 'visual' as const, item: img, source: img.url || img.image })),
      ...films.map(film => ({ type: 'film' as const, item: film, source: film.poster_url || film.poster })),
      ...albums.map(album => ({ type: 'music' as const, item: album, source: album.image || album.cover })),
      ...quotes.map(quote => ({ type: 'quote' as const, item: quote, source: quote.image || quote.background })),
    ].filter(item => item.source)

    // Shuffle and take up to 12 items for the collage
    const shuffled = allContent.sort(() => Math.random() - 0.5)
    const selectedContent = shuffled.slice(0, 12)

    const collageItems: LayoutSlot[] = selectedContent.map(({ type, item, source }) => ({
      type,
      source,
      title: item.title || item.name,
      subtitle: item.artist || item.director || item.year
    }))

    return {
      heroSlot: hero,
      collageSlots: collageItems
    }
  }, [originalImage, originalImageName, films, albums, aestheticImages, quotes, providedSlots, providedHeroSlot])

  if (!heroSlot && collageSlots.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No content available for collage layout</p>
      </div>
    )
  }

  // Define grid areas for masonry-like layout
  const gridAreas = [
    'hero hero small1 small2',
    'hero hero small3 small4', 
    'medium1 medium2 small5 small6',
    'medium3 medium4 small7 small8',
    'wide1 wide1 small9 small10',
    'small11 small12 medium5 medium6'
  ]

  const getGridClass = (index: number): string => {
    const classes = [
      'col-span-2 row-span-2', // hero
      'col-span-1 row-span-1', // small1
      'col-span-1 row-span-1', // small2
      'col-span-1 row-span-1', // small3
      'col-span-1 row-span-1', // small4
      'col-span-1 row-span-1', // small5
      'col-span-1 row-span-1', // small6
      'col-span-1 row-span-1', // small7
      'col-span-1 row-span-1', // small8
      'col-span-1 row-span-1', // small9
      'col-span-1 row-span-1', // small10
      'col-span-2 row-span-1', // wide1
      'col-span-1 row-span-2', // medium1
    ]
    return classes[index] || 'col-span-1 row-span-1'
  }

  const getImageClass = (index: number): string => {
    if (index === 0) return 'w-full h-full object-cover rounded-lg shadow-md' // hero
    return 'w-full h-full object-cover rounded-md'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-5xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-light text-gray-800 tracking-wide">
          {vibe ? `${vibe} universe` : 'aesthetic collage'}
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-3 auto-rows-fr h-[600px]">
        {/* Hero image */}
        {heroSlot && (
          <div className="col-span-2 row-span-3 relative group">
            <img
              src={heroSlot.source}
              alt={heroSlot.title || 'main product'}
              className="w-full h-full object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/api/placeholder/400/600'
              }}
            />
            <div className="absolute bottom-3 left-3 right-3">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-md p-2">
                <p className="text-white text-sm font-medium truncate">
                  {heroSlot.title}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Collage items */}
        {collageSlots.map((slot, index) => {
          // Calculate grid position (skip hero position)
          const position = index
          const isWide = position === 10 // wide1 position
          const isTall = position === 11 || position === 12 // medium positions
          
          return (
            <div 
              key={index}
              className={`
                relative group overflow-hidden
                ${isWide ? 'col-span-2' : 'col-span-1'}
                ${isTall ? 'row-span-2' : 'row-span-1'}
              `}
            >
              <img
                src={slot.source}
                alt={slot.title || `collage item ${index + 1}`}
                className="w-full h-full object-cover rounded-md transition-all duration-300 group-hover:scale-105 group-hover:brightness-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/api/placeholder/150/150'
                }}
              />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-md flex items-end p-2">
                {slot.title && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs font-medium truncate">
                      {slot.title}
                    </p>
                    {slot.subtitle && (
                      <p className="text-white text-xs opacity-80 truncate">
                        {slot.subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          {heroSlot ? 1 : 0} product • {collageSlots.filter(s => s.type === 'visual').length} visuals • 
          {collageSlots.filter(s => s.type === 'music').length} albums • 
          {collageSlots.filter(s => s.type === 'film').length} films
        </p>
      </div>

      {collageSlots.length > 12 && (
        <div className="mt-4 text-center">
          <button className="text-xs text-gray-500 hover:text-gray-700 underline">
            +{collageSlots.length - 12} more items in this {vibe} universe
          </button>
        </div>
      )}
    </div>
  )
}