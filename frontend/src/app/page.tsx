'use client'

import { useState } from 'react'
import ProductUpload, { ProductContext } from '../components/ProductUpload'
import FilmReferences from '../components/FilmReferences'
import MusicPlaylist from '../components/MusicPlaylist'
import AlbumCovers from '../components/AlbumCovers'
import AestheticImages from '../components/AestheticImages'
import MoodboardCollector from '../components/MoodboardCollector'

export default function Home() {
  const [vibe, setVibe] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [productContext, setProductContext] = useState<ProductContext | null>(null)
  const [generatedBoard, setGeneratedBoard] = useState(false)
  const [apiTags, setApiTags] = useState<any>(null) // Store enhanced API tags from CLIP analysis

  const handleGenerateBoard = async () => {
    console.log('🎯 Generate button clicked!')
    console.log('🔍 State check:', { vibe, productImage: !!productImage, productContext: !!productContext, generatedBoard })
    
    if (!productImage) {
      alert('Please upload an image first')
      return
    }
    
    console.log('✅ All validation passed, setting generatedBoard to true...')
    setGeneratedBoard(true)
    console.log('✅ GeneratedBoard state set to true')
    
    // Content will auto-generate when available, no need for manual triggering
  }

  const handleImageUpload = (file: File, imageUrl: string) => {
    setProductImage(imageUrl)
    // Auto-trigger analysis and moodboard generation when image changes
    setTimeout(() => {
      if (generatedBoard) {
        setGeneratedBoard(false) // Reset to trigger re-generation
        setTimeout(() => setGeneratedBoard(true), 100)
      }
    }, 500)
  }

  const handleContextSubmit = (context: ProductContext & { apiTags?: any }) => {
    console.log('📝 Context submitted:', context)
    setProductContext(context)
    setVibe(context.brandVibe) // Use brand vibe as the aesthetic search term
    
    // Store API tags from CLIP analysis if available
    if (context.apiTags) {
      setApiTags(context.apiTags)
      console.log('🎯 API tags stored from CLIP analysis:', context.apiTags)
    }
    
    console.log('🎯 Vibe set to:', context.brandVibe)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-4 tracking-wide">
            palette
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto font-light">
            give your product a world of its own.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <ProductUpload 
            onImageUpload={handleImageUpload}
            onContextSubmit={handleContextSubmit}
          />
          
          <div className="mt-6">
            <button 
              data-generate-btn
              onClick={handleGenerateBoard}
              className="w-full bg-gray-900 text-white font-medium py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors"
            >
              generate moodboard
            </button>
          </div>
        </div>

        {(() => {
          console.log('🔍 Render condition check:', { generatedBoard, vibe: !!vibe, shouldRender: generatedBoard && vibe })
          return generatedBoard && vibe ? (
            <div className="space-y-6">
              {/* Moodboard Generator - This contains all the curated content INCLUDING original product */}
              <MoodboardCollector 
                vibe={vibe} 
                apiTags={apiTags}
                originalImage={productImage}
                originalImageName={productContext?.productName || 'your product'}
                shouldGenerate={generatedBoard}
              />
            </div>
          ) : null
        })()}

        {!generatedBoard && (
          <div className="text-center text-gray-400 text-sm">
            <p>upload an image to get started</p>
          </div>
        )}
      </div>
    </main>
  )
}
