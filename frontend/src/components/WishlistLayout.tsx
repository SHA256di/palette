'use client'

import React, { useMemo } from 'react'
import { WishlistLayoutProps, LayoutSlot } from '../types/layouts'

export default function WishlistLayout({ 
  vibe, 
  originalImageName, 
  moodboardImages = [],
  slots: providedSlots 
}: WishlistLayoutProps) {
  
  const generateCaptions = (_item: any, type: string): string => {
    // Simple captions without "need this in my life" text
    const captions = {
      product: [
        `${originalImageName?.toLowerCase() || 'essential piece'}`,
        `aesthetic goals`,
        `this but make it ${vibe}`,
      ],
      music: [
        'soundtrack to my life',
        'play this while getting ready',
        'music that gets it',
        `${vibe} playlist vibes`,
      ],
      film: [
        'rewatch for the aesthetics',
        'comfort movie energy',
        'film that changed me',
        `${vibe} cinema`,
      ],
      visual: [
        'pinterest board goals',
        'mood captured',
        `${vibe} aesthetic`,
        'visual diary entry',
      ],
      quote: [
        'words to live by',
        'perfectly said',
        'energy check',
        'manifesting this',
      ]
    }
    
    const captionList = captions[type as keyof typeof captions] || captions.visual
    return captionList[Math.floor(Math.random() * captionList.length)]
  }

  // Images are now provided through moodboardImages from the Gemini + Google Search workflow

  const slots = useMemo(() => {
    if (providedSlots) return providedSlots

    const allSlots: LayoutSlot[] = []

    // Use moodboard images directly - the uploaded product image is already included as the first item
    console.log(`🛍️ WishlistLayout: Using ${moodboardImages.length} moodboard images for "${vibe}" aesthetic`)
    
    // Take the first 4 images for a 2x2 grid
    const selectedImages = moodboardImages.slice(0, 4)

    selectedImages.forEach((img) => {
      const isOriginal = img.source === 'upload'
      allSlots.push({
        type: isOriginal ? 'product' : 'visual',
        source: img.url,
        caption: generateCaptions(img, isOriginal ? 'product' : 'visual'),
        originalImage: isOriginal,
        title: img.alt,
        subtitle: isOriginal ? originalImageName : undefined
      })
    })

    return allSlots
  }, [moodboardImages, vibe, originalImageName, providedSlots])

  if (slots.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <p>No content available for wishlist layout</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-light text-center mb-8 text-gray-800 tracking-wide">
        my wishlist
      </h2>
      
      <div className="grid grid-cols-2 gap-8">
        {slots.slice(0, 4).map((slot, index) => (
          <div key={index} className="flex flex-col items-center group">
            <div className="relative overflow-hidden rounded-lg bg-gray-100 w-full aspect-square">
              <img 
                src={slot.source} 
                alt={slot.caption || `wishlist item ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/api/placeholder/300/300'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {slots.length > 4 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            +{slots.length - 4} more items in your {vibe} universe
          </p>
        </div>
      )}
    </div>
  )
}