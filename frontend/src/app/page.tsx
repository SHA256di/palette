'use client'

import { useState, useEffect } from 'react'
import ProductUpload, { ProductContext } from '../components/ProductUpload'
import PerfumeLayout from '../components/PerfumeLayout'
import WishlistStaticLayout from '../components/WishlistStaticLayout'


export default function Home() {
  const [vibe, setVibe] = useState('')
  const [productImage, setProductImage] = useState<string | null>(null)
  const [productContext, setProductContext] = useState<ProductContext | null>(null)
  const [generatedBoard, setGeneratedBoard] = useState(false)
  const [selectedLayout, setSelectedLayout] = useState<'perfume' | 'wishlist'>('perfume')
  const [isClient, setIsClient] = useState(false)
  // const [apiTags, setApiTags] = useState<any>(null) // Store enhanced API tags from CLIP analysis

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleContextSubmit = (context: ProductContext & { apiTags?: any }) => {
    console.log('📝 Context submitted:', context)
    setProductContext(context)
    setVibe(context.brandVibe) // Use brand vibe as the aesthetic search term
    
    // Store API tags from CLIP analysis if available
    // if (context.apiTags) {
    //   setApiTags(context.apiTags)
    //   console.log('🎯 API tags stored from CLIP analysis:', context.apiTags)
    // }
    
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
          
          {/* Layout Selection */}
          {isClient && (
            <div className="mt-6 mb-6">
              <h3 className="text-lg font-light text-gray-700 mb-4 text-center">choose your layout</h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setSelectedLayout('perfume')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedLayout === 'perfume'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  perfume notes
                </button>
                <button
                  onClick={() => setSelectedLayout('wishlist')}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedLayout === 'wishlist'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  wishlist
                </button>
              </div>
            </div>
          )}
          
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
          console.log('🔍 Render condition check:', { generatedBoard, productImage: !!productImage, shouldRender: generatedBoard && productImage })
          return generatedBoard && productImage ? (
            <div className="space-y-6">
              {selectedLayout === 'perfume' ? (
                <PerfumeLayout 
                  originalImage={productImage}
                  originalImageName={productContext?.productName || 'your product'}
                />
              ) : (
                <WishlistStaticLayout 
                  originalImage={productImage}
                />
              )}
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
