'use client'

import React, { useMemo } from 'react'
import { PerfumeLayoutProps, LayoutSlot } from '../types/layouts'

interface PerfumeRow {
  title: string
  slots: LayoutSlot[]
}

export default function PerfumeLayout({
  vibe,
  originalImage,
  originalImageName,
  films = [],
  albums = [],
  aestheticImages = [],
  quotes = [],
  topNotes: providedTopNotes,
  middleNotes: providedMiddleNotes,
  baseNotes: providedBaseNotes
}: PerfumeLayoutProps) {

  const generatePerfumeDescriptors = (item: any, type: string, noteType: 'top' | 'middle' | 'base'): string => {
    const descriptors = {
      top: {
        visual: ['ethereal', 'bright', 'sparkling', 'fresh', 'luminous', 'delicate', 'airy'],
        music: ['uplifting', 'energetic', 'vibrant', 'melodic', 'harmonious', 'rhythmic'],
        film: ['dreamy', 'nostalgic', 'whimsical', 'romantic', 'cinematic', 'enchanting'],
        product: ['elegant', 'refined', 'sophisticated', 'luxurious', 'pristine'],
        quote: ['inspiring', 'hopeful', 'motivational', 'enlightening']
      },
      middle: {
        visual: ['complex', 'layered', 'rich', 'textured', 'nuanced', 'emotional', 'expressive'],
        music: ['soulful', 'passionate', 'dramatic', 'intense', 'captivating', 'powerful'],
        film: ['compelling', 'thought-provoking', 'immersive', 'transformative', 'profound'],
        product: ['substantial', 'meaningful', 'impactful', 'significant', 'essential'],
        quote: ['deep', 'resonant', 'meaningful', 'philosophical', 'introspective']
      },
      base: {
        visual: ['grounding', 'earthy', 'warm', 'comforting', 'stable', 'enduring', 'timeless'],
        music: ['foundational', 'solid', 'reliable', 'classic', 'lasting', 'authentic'],
        film: ['memorable', 'iconic', 'influential', 'enduring', 'legendary', 'definitive'],
        product: ['dependable', 'trustworthy', 'fundamental', 'core', 'essential'],
        quote: ['wisdom', 'truth', 'permanence', 'strength', 'foundation']
      }
    }

    const typeDescriptors = descriptors[noteType][type as keyof typeof descriptors[noteType]] || descriptors[noteType].visual
    return typeDescriptors[Math.floor(Math.random() * typeDescriptors.length)]
  }

  const { topNotes, middleNotes, baseNotes } = useMemo(() => {
    if (providedTopNotes && providedMiddleNotes && providedBaseNotes) {
      return { topNotes: providedTopNotes, middleNotes: providedMiddleNotes, baseNotes: providedBaseNotes }
    }

    // Create content pools
    const allContent = [
      ...aestheticImages.map(img => ({ type: 'visual' as const, item: img, source: img.url || img.image })),
      ...films.map(film => ({ type: 'film' as const, item: film, source: film.poster_url || film.poster })),
      ...albums.map(album => ({ type: 'music' as const, item: album, source: album.image || album.cover })),
      ...quotes.map(quote => ({ type: 'quote' as const, item: quote, source: quote.image || quote.background })),
    ].filter(item => item.source)

    // Shuffle all content
    const shuffled = [...allContent].sort(() => Math.random() - 0.5)

    // Distribute content across the three note levels
    const contentPerLevel = Math.min(4, Math.floor(shuffled.length / 3))
    
    const createNoteSlots = (content: typeof shuffled, noteType: 'top' | 'middle' | 'base'): LayoutSlot[] => {
      return content.map(({ type, item, source }) => ({
        type,
        source,
        caption: generatePerfumeDescriptors(item, type, noteType),
        title: item.title || item.name,
        subtitle: item.artist || item.director || item.year
      }))
    }

    const topContent = shuffled.slice(0, contentPerLevel)
    const middleContent = shuffled.slice(contentPerLevel, contentPerLevel * 2)
    const baseContent = shuffled.slice(contentPerLevel * 2, contentPerLevel * 3)

    // Add original product to middle notes if available
    const middleSlots = createNoteSlots(middleContent, 'middle')
    if (originalImage && middleSlots.length < 4) {
      middleSlots.unshift({
        type: 'product',
        source: originalImage,
        caption: generatePerfumeDescriptors(null, 'product', 'middle'),
        title: originalImageName || 'your product',
        originalImage: true
      })
    }

    return {
      topNotes: createNoteSlots(topContent, 'top'),
      middleNotes: middleSlots,
      baseNotes: createNoteSlots(baseContent, 'base')
    }
  }, [originalImage, originalImageName, films, albums, aestheticImages, quotes, vibe, providedTopNotes, providedMiddleNotes, providedBaseNotes])

  const rows: PerfumeRow[] = [
    { title: 'top notes:', slots: topNotes },
    { title: 'middle notes:', slots: middleNotes },
    { title: 'base notes:', slots: baseNotes }
  ]

  const totalContent = topNotes.length + middleNotes.length + baseNotes.length

  if (totalContent === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No content available for perfume layout</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-light text-center mb-12 text-gray-800 tracking-wide">
        {vibe ? `${vibe} as a perfume` : 'me as a perfume'}
      </h1>

      <div className="space-y-12">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="space-y-6">
            <h2 className="text-2xl font-light text-gray-700 text-center tracking-wide">
              {row.title}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {row.slots.slice(0, 4).map((slot, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full aspect-square mb-4">
                    <img
                      src={slot.source}
                      alt={slot.caption || `${row.title} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/api/placeholder/200/200'
                      }}
                    />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm italic text-gray-800 font-light tracking-wide">
                      {slot.caption}
                    </p>
                    {slot.title && (
                      <p className="text-xs text-gray-500 mt-2">
                        {slot.title}
                        {slot.subtitle && ` • ${slot.subtitle}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {row.slots.length > 4 && (
              <div className="text-center">
                <p className="text-xs text-gray-400">
                  +{row.slots.length - 4} more {row.title.replace(':', '')}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400 italic">
          a fragrance that tells your story
        </p>
      </div>
    </div>
  )
}