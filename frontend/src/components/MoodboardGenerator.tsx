'use client'

import { useState, useRef, useEffect } from 'react'
import { generateMoodboardLayout, exportMoodboardAsImage, type MoodboardLayout } from '@/lib/moodboard'

interface MoodboardGeneratorProps {
  vibe: string
  films: any[]
  albums: any[]
  aestheticImages: any[]
}

export default function MoodboardGenerator({ vibe, films, albums, aestheticImages }: MoodboardGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layout, setLayout] = useState<MoodboardLayout | null>(null)
  const [layoutStyle, setLayoutStyle] = useState<'grid' | 'organic' | 'scattered'>('organic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const generateMoodboard = async () => {
    if (films.length === 0 && albums.length === 0 && aestheticImages.length === 0) {
      alert('Please generate some content first (films, albums, or images)')
      return
    }

    setIsGenerating(true)
    
    try {
      const newLayout = generateMoodboardLayout(films, albums, aestheticImages, {
        width: 1200,
        height: 800,
        style: layoutStyle
      })
      
      setLayout(newLayout)
      await renderMoodboard(newLayout)
    } catch (error) {
      console.error('Error generating moodboard:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMoodboard = async (moodboardLayout: MoodboardLayout) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    canvas.width = moodboardLayout.width
    canvas.height = moodboardLayout.height
    
    // Clear and fill background
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

    // Load and draw images
    const imagePromises = moodboardLayout.elements.map((element) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        
        img.onload = () => {
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
          resolve()
        }
        
        img.onerror = () => {
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

  // Auto-generate when style changes
  useEffect(() => {
    if (layout) {
      generateMoodboard()
    }
  }, [layoutStyle])

  const hasContent = films.length > 0 || albums.length > 0 || aestheticImages.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Moodboard Generator</h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={layoutStyle}
            onChange={(e) => setLayoutStyle(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="organic">Organic</option>
            <option value="grid">Grid</option>
            <option value="scattered">Scattered</option>
          </select>
          
          <button
            onClick={generateMoodboard}
            disabled={isGenerating || !hasContent}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Generate Moodboard'}
          </button>
        </div>
      </div>

      {!hasContent && (
        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-600 mb-2">No content available for moodboard</p>
          <p className="text-sm text-gray-500">
            Generate films, album covers, or aesthetic images first
          </p>
        </div>
      )}

      {hasContent && !layout && (
        <div className="p-8 border-2 border-dashed border-purple-300 rounded-lg text-center">
          <p className="text-purple-600 mb-2">Ready to create your moodboard!</p>
          <p className="text-sm text-gray-600">
            Available content: {films.length} films, {albums.length} albums, {aestheticImages.length} images
          </p>
        </div>
      )}

      {layout && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{layout.style}</span> style moodboard with {layout.elements.length} elements
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={exportMoodboard}
                disabled={isExporting}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Download PNG'}
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-auto max-w-full"
              style={{ display: 'block' }}
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