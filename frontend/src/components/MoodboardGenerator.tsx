'use client'

import { useState, useRef, useEffect } from 'react'
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

export default function MoodboardGenerator({ vibe, films, albums, aestheticImages, quotes, originalImage, originalImageName }: MoodboardGeneratorProps) {
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
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layout, setLayout] = useState<MoodboardLayout | null>(null)
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'organic' | 'scattered'>('scattered')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const generateMoodboard = async () => {
    console.log('🎨 generateMoodboard called - Films:', films.length, 'Albums:', albums.length, 'Images:', aestheticImages.length, 'OriginalImage:', !!originalImage)
    
    if (films.length === 0 && albums.length === 0 && aestheticImages.length === 0) {
      console.log('❌ No content available for moodboard')
      return
    }

    setIsGenerating(true)
    console.log('🔄 Starting moodboard generation...')
    
    try {
      const newLayout = generateMoodboardLayout(films, albums, aestheticImages, {
        width: 1200,
        height: 800,
        style: layoutStyle,
        originalImage: originalImage || undefined,
        quotes: quotes || []
      })
      
      console.log('✅ Layout generated with', newLayout.elements.length, 'elements')
      setLayout(newLayout)
      console.log('🎨 Rendering moodboard to canvas...')
      await renderMoodboard(newLayout)
      console.log('✅ Moodboard rendered successfully')
    } catch (error) {
      console.error('❌ Error generating moodboard:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMoodboard = async (moodboardLayout: MoodboardLayout) => {
    console.log('🖼️ renderMoodboard called with layout:', { width: moodboardLayout.width, height: moodboardLayout.height, elements: moodboardLayout.elements.length })
    
    const canvas = canvasRef.current
    if (!canvas) {
      console.error('❌ Canvas ref is null!')
      return
    }

    const ctx = canvas.getContext('2d')!
    canvas.width = moodboardLayout.width
    canvas.height = moodboardLayout.height
    
    console.log('📐 Canvas dimensions set:', { width: canvas.width, height: canvas.height, visible: canvas.offsetWidth })
    
    // Clear canvas completely first
    ctx.clearRect(0, 0, moodboardLayout.width, moodboardLayout.height)
    
    // Fill background
    ctx.fillStyle = moodboardLayout.backgroundColor
    ctx.fillRect(0, 0, moodboardLayout.width, moodboardLayout.height)
    
    // Add some texture/grain effect for aesthetic appeal
    if (moodboardLayout.style === 'organic') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      for (let i = 0; i < 1000; i++) {
        ctx.fillRect(
          Math.random() * moodboardLayout.width,
          Math.random() * moodboardLayout.height,
          1, 1
        )
      }
    }

    // Load and draw images with safety checks
    const imagePromises = moodboardLayout.elements.map((element, index) => {
      return new Promise<void>((resolve) => {
        // Safety check: validate image URL
        if (!element.url || !element.url.startsWith('http')) {
          console.warn('Invalid image URL skipped:', element.url)
          resolve()
          return
        }

        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        // Set timeout for image loading (5 seconds max)
        const timeout = setTimeout(() => {
          console.warn('Image load timeout:', element.url)
          resolve()
        }, 5000)
        
        img.onload = () => {
          clearTimeout(timeout)
          
          // Safety check: validate image dimensions
          if (img.width < 50 || img.height < 50) {
            console.warn('Image too small, skipping:', element.url)
            resolve()
            return
          }

          try {
            ctx.save()
            
            // Apply opacity
            ctx.globalAlpha = element.opacity || 1
            
            // Apply rotation and positioning
            ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
            if (element.rotation) {
              ctx.rotate(element.rotation * Math.PI / 180)
            }
            
            // Draw the image
            ctx.drawImage(
              img,
              -element.width / 2,
              -element.height / 2,
              element.width,
              element.height
            )
            
            ctx.restore()
          } catch (error) {
            console.error('Error drawing image:', error, element.url)
          }
          
          resolve()
        }
        
        img.onerror = () => {
          clearTimeout(timeout)
          console.error('Failed to load image:', element.url)
          resolve()
        }
        
        img.src = element.url
      })
    })

    await Promise.all(imagePromises)
  }

  const exportMoodboard = async () => {
    if (!layout) return

    setIsExporting(true)
    
    try {
      const dataUrl = await exportMoodboardAsImage(layout, 'png')
      
      // Create download link
      const link = document.createElement('a')
      link.download = `${vibe.replace(/\s+/g, '-').toLowerCase()}-moodboard.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Error exporting moodboard:', error)
      alert('Failed to export moodboard')
    } finally {
      setIsExporting(false)
    }
  }

  const copyToClipboard = async () => {
    if (!layout) return

    try {
      const dataUrl = await exportMoodboardAsImage(layout, 'png')
      
      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      // Copy to clipboard
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      
      alert('Moodboard copied to clipboard!')
    } catch (error) {
      console.error('Error copying to clipboard:', error)
      alert('Failed to copy to clipboard')
    }
  }

  const hasContent = films.length > 0 || albums.length > 0 || aestheticImages.length > 0

  // Listen for generate event from main button
  useEffect(() => {
    const handleGenerate = () => {
      console.log('🎯 Received generate-moodboard event, hasContent:', hasContent)
      if (hasContent) {
        console.log('✅ Content available, generating moodboard...')
        generateMoodboard()
      } else {
        console.log('❌ No content available yet')
      }
    }
    
    window.addEventListener('generate-moodboard', handleGenerate)
    return () => window.removeEventListener('generate-moodboard', handleGenerate)
  }, [hasContent])

  // Auto-generate when content becomes available (only once)  
  useEffect(() => {
    if (hasContent && !layout && !isGenerating) {
      console.log('🎯 Content just became available, auto-generating moodboard...')
      console.log('Films:', films.length, 'Albums:', albums.length, 'Images:', aestheticImages.length)
      setTimeout(() => generateMoodboard(), 100)
    }
  }, [films.length, albums.length, aestheticImages.length])

  // Auto-generate when style changes
  useEffect(() => {
    if (layout) {
      generateMoodboard()
    }
  }, [layoutStyle])

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

      {/* Legacy canvas-based moodboard (hidden by default, can be toggled for comparison) */}
      {layout && false && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{layout.style}</span> style moodboard with {layout.elements.length} elements
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={exportMoodboard}
                disabled={isExporting}
                className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {isExporting ? 'exporting...' : 'download png'}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-w-full"
              style={{ display: 'block', minHeight: '400px', backgroundColor: '#f8f9fa' }}
            />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              "{vibe}" aesthetic moodboard • {layout.width} × {layout.height}px
            </p>
          </div>
        </div>
      )}
    </div>
  )
}