'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { WishlistLayoutProps, LayoutSlot } from '../types/layouts'
import { filterForProducts } from '../lib/aesthetic-mapping'

export default function WishlistLayout({ 
  vibe, 
  originalImage, 
  originalImageName, 
  films = [], 
  albums = [], 
  aestheticImages = [], 
  quotes = [],
  slots: providedSlots 
}: WishlistLayoutProps) {
  
  const generateCaptions = (item: any, type: string): string => {
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

  // For wishlist layouts, we need to fetch additional PRODUCT-FOCUSED images
  // since the detected vibe might be too abstract (like "cyber_fairy")
  const [wishlistImages, setWishlistImages] = useState<any[]>([])
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)

  useEffect(() => {
    const fetchWishlistImages = async () => {
      if (isLoadingWishlist) return
      
      setIsLoadingWishlist(true)
      console.log(`🛍️ Fetching additional product-focused images for wishlist layout`)
      
      try {
        // Search for generic product terms instead of the detected vibe
        const productSearchTerms = ['wishlist', 'shopping haul', 'cute things', 'aesthetic objects', 'girly stuff']
        const responses = await Promise.all(
          productSearchTerms.map(term =>
            fetch('/api/aesthetic-images', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ vibe: term, limit: 3, removeBackground: false })
            })
          )
        )
        
        const imageData = await Promise.all(
          responses.map(response => response.ok ? response.json() : { images: [] })
        )
        
        const allWishlistImages = imageData.flatMap(data => data.images || [])
        console.log(`🛍️ Fetched ${allWishlistImages.length} product-focused images`)
        setWishlistImages(allWishlistImages)
        
      } catch (error) {
        console.error('❌ Error fetching wishlist images:', error)
        setWishlistImages([])
      } finally {
        setIsLoadingWishlist(false)
      }
    }
    
    fetchWishlistImages()
  }, [])

  const slots = useMemo(() => {
    if (providedSlots) return providedSlots

    const allSlots: LayoutSlot[] = []

    // Slot 0: Always the original product image
    if (originalImage) {
      allSlots.push({
        type: 'product',
        source: originalImage,
        caption: generateCaptions(null, 'product'),
        originalImage: true
      })
    }

    // Combine original aesthetic images with wishlist-specific images
    const combinedImages = [...aestheticImages, ...wishlistImages]
    
    // First try to get product-filtered images (strict mode for wishlist)
    const productFilteredImages = combinedImages.filter(img => {
      const tags = img.tags || []
      return filterForProducts(img, tags, true) // strict = true for wishlist
    })
    
    console.log(`🛍️ Product filtering: ${combinedImages.length} total (${aestheticImages.length} original + ${wishlistImages.length} wishlist-specific) → ${productFilteredImages.length} product-like images`)
    console.log(`🛍️ Detected vibe: "${vibe}" - using additional product-focused searches`)
    
    // If we don't have enough product-filtered images, fall back to all images
    const imagesToUse = productFilteredImages.length >= 3 ? productFilteredImages : combinedImages
    console.log(`🛍️ Using ${imagesToUse.length} images for wishlist (${productFilteredImages.length < 3 ? 'fallback to all images' : 'product-filtered only'})`)
    
    const allContent = [
      ...imagesToUse.map(img => ({ type: 'visual' as const, item: img, source: img.url || img.image })),
      ...quotes.map(quote => ({ type: 'quote' as const, item: quote, source: quote.image || quote.background })),
    ].filter(item => item.source)

    // Shuffle and take exactly 3 more items (for total of 4 in 2x2 grid)
    const shuffled = allContent.sort(() => Math.random() - 0.5)
    const selectedContent = shuffled.slice(0, 3)

    selectedContent.forEach(({ type, item, source }) => {
      allSlots.push({
        type,
        source,
        caption: generateCaptions(item, type),
        title: item.title || item.name,
        subtitle: item.artist || item.director || item.year
      })
    })

    return allSlots
  }, [originalImage, originalImageName, films, albums, aestheticImages, quotes, vibe, wishlistImages, providedSlots])

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