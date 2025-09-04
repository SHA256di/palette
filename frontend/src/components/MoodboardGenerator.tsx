'use client'

import { useState, useEffect } from 'react'
import { generateMoodboardLayout, exportMoodboardAsImage, type MoodboardLayout } from '@/lib/moodboard'
import WishlistLayout from './WishlistLayout'

interface MoodboardGeneratorProps {
  vibe: string
  films: any[]
  albums: any[]
  aestheticImages: any[]
  quotes: any[]
  originalImage?: string | null
  originalImageName?: string
}

export default function MoodboardGenerator({
  vibe,
  films,
  albums,
  aestheticImages,
  quotes,
  originalImage,
  originalImageName
}: MoodboardGeneratorProps) {
  console.log('🎨 MoodboardGenerator rendered with:', {
    vibe,
    films: films.length,
    albums: albums.length,
    aestheticImages: aestheticImages.length,
    quotes: quotes.length,
    originalImage: !!originalImage
  })
  
  console.log('🎨 MoodboardGenerator content details:', {
    films: films.map(f => f.title || f.name || 'untitled'),
    albums: albums.map(a => a.name || 'untitled'),  
    aestheticImages: aestheticImages.slice(0,3).map(i => i.url?.substring(0,50) || 'no-url')
  })

  // --- Canvas-related state (disabled for now) ---
  /*
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layout, setLayout] = useState<MoodboardLayout | null>(null)
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'organic' | 'scattered'>('scattered')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const generateMoodboard = async () => {
    console.log('🎨 generateMoodboard called - Films:', films.length, 'Albums:', albums.length, 'Images:', aestheticImages.length, 'OriginalImage:', !!originalImage)
    if (films.length === 0 && albums.length === 0 && aestheticImages.length === 0) return

    setIsGenerating(true)
    try {
      const newLayout = generateMoodboardLayout(films, albums, aestheticImages, {
        width: 1200,
        height: 800,
        style: layoutStyle,
        originalImage: originalImage || undefined,
        quotes: quotes || []
      })
      setLayout(newLayout)
      await renderMoodboard(newLayout)
    } catch (error) {
      console.error('❌ Error generating moodboard:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMoodboard = async (moodboardLayout: MoodboardLayout) => {
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('❌ Canvas ref is null!')
      return
    }
    // ... drawing code ...
  }

  const exportMoodboard = async () => {
    if (!layout) return
    setIsExporting(true)
    try {
      const dataUrl = await exportMoodboardAsImage(layout, 'png')
      const link = document.createElement('a')
      link.download = `${vibe.replace(/\s+/g, '-').toLowerCase()}-moodboard.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting moodboard:', error)
    } finally {
      setIsExporting(false)
    }
  }
  */

  const hasContent = films.length > 0 || albums.length > 0 || aestheticImages.length > 0

  return (
    <div className="space-y-6">
      {!hasContent && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-600 mb-2">No content available for moodboard</p>
          <p className="text-sm text-gray-500">
            Generate films, album covers, or aesthetic images first
          </p>
        </div>
      )}

      {hasContent && (
        <WishlistLayout 
          vibe={vibe}
          originalImage={originalImage}
          originalImageName={originalImageName}
          films={films}
          albums={albums}
          aestheticImages={aestheticImages}
          quotes={quotes}
        />
      )}

      {/* Legacy canvas-based moodboard (disabled for now) */}
      {/*
      {layout && (
        <div className="space-y-4">
          <canvas ref={canvasRef} />
        </div>
      )}
      */}
    </div>
  )
}
