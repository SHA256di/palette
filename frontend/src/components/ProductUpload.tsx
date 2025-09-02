'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface ProductUploadProps {
  onImageUpload: (file: File, imageUrl: string) => void
  onContextSubmit: (context: ProductContext) => void
}

interface ProductContext {
  productName: string
  productType: string
  targetAudience: string
  brandVibe: string
  additionalContext: string
}

export default function ProductUpload({ onImageUpload, onContextSubmit }: ProductUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showContextForm, setShowContextForm] = useState(false)
  const [context, setContext] = useState<ProductContext>({
    productName: '',
    productType: '',
    targetAudience: 'Gen Z', // Always Gen Z focused
    brandVibe: '',
    additionalContext: ''
  })
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setUploadedFile(file)
    setShowContextForm(true)
    onImageUpload(file, imageUrl)

    // Analyze image with CLIP
    try {
      console.log('🔍 Analyzing image with CLIP...')
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✨ CLIP Analysis:', result.analysis)
        console.log('🎯 CLIP detected aesthetics:', result.analysis.aestheticTags)
        console.log('🎯 API tags from analysis:', result.analysis.apiTags)
        
        // Use the actual detected aesthetic and its API tags
        const detectedAesthetic = result.analysis.detectedAesthetics?.[0]?.aesthetic || 'girlblogger'
        console.log('🎯 Using detected aesthetic:', detectedAesthetic)
        
        const updatedContext = {
          productName: context.productName,
          productType: 'product', 
          targetAudience: 'Gen Z', 
          brandVibe: detectedAesthetic, // Use actual detected aesthetic
          additionalContext: context.additionalContext,
          apiTags: result.analysis.apiTags // Use API tags from analysis
        }
        
        setContext(updatedContext)
        
        // Submit context but don't auto-generate moodboard
        console.log('🔄 Context ready with API tags:', updatedContext)
        onContextSubmit(updatedContext)
      } else {
        console.error('CLIP analysis failed:', result.error)
      }
    } catch (error) {
      console.error('Error analyzing image:', error)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleContextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onContextSubmit(context)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Upload Area */}
      {!uploadedImage && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-12 text-center transition-colors
            ${dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload your product image</h3>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your product photo, logo, or brand asset
              </p>
            </div>
            <div>
              <label className="cursor-pointer">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose file
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileInput}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="mb-6">
          <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg">
            <Image
              src={uploadedImage}
              alt="Uploaded product"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => {
                setUploadedImage(null)
                setUploadedFile(null)
                setShowContextForm(false)
                setContext({
                  productName: '',
                  productType: '',
                  targetAudience: 'Gen Z', // Always Gen Z focused
                  brandVibe: '',
                  additionalContext: ''
                })
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Change image
            </button>
          </div>
        </div>
      )}

      {/* Context Form */}
      {showContextForm && (
        <form onSubmit={handleContextSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details (Optional)</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Description <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <input
                  type="text"
                  value={context.productName}
                  onChange={(e) => {
                    setContext({ ...context, productName: e.target.value })
                    
                    // Don't auto-trigger analysis on typing - let user control when to generate
                  }}
                  placeholder="e.g., Handmade Silver Rings, Minimalist Watch, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Context <span className="text-gray-400 text-sm">(optional)</span>
                </label>
                <textarea
                  value={context.additionalContext}
                  onChange={(e) => setContext({ ...context, additionalContext: e.target.value })}
                  placeholder="Any additional context about the product or desired aesthetic..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

        </form>
      )}
    </div>
  )
}

export type { ProductContext }