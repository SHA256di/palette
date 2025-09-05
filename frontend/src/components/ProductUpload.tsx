'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { AESTHETICS } from '../lib/aesthetics'

interface ProductUploadProps {
  onImageUpload: (file: File, imageUrl: string) => void
  onMoodboardGenerate: (file: File, aesthetic: string) => void
}


export default function ProductUpload({ onImageUpload, onMoodboardGenerate }: ProductUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedAesthetic, setSelectedAesthetic] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

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
    onImageUpload(file, imageUrl)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleGenerateMoodboard = async () => {
    if (!uploadedFile) return
    
    setIsGenerating(true)
    try {
      await onMoodboardGenerate(uploadedFile, selectedAesthetic)
    } finally {
      setIsGenerating(false)
    }
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
            <h3 className="text-lg font-medium text-gray-900">Upload a picture to make a moodboard</h3>
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
      )}

      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="mb-6">
          <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-lg">
            <Image src={uploadedImage} alt="Uploaded product" fill className="object-cover" />
          </div>

          {/* Aesthetic selection */}
          <div className="mt-6 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select an aesthetic (or let AI detect automatically)
            </label>
            <select
              value={selectedAesthetic}
              onChange={(e) => setSelectedAesthetic(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">Auto-detect with AI</option>
              {AESTHETICS.map((aesthetic) => (
                <option key={aesthetic.id} value={aesthetic.id}>
                  {aesthetic.name}
                </option>
              ))}
            </select>

            {selectedAesthetic && (
              <div className="text-xs text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
                <p><strong>{AESTHETICS.find(a => a.id === selectedAesthetic)?.name}</strong></p>
                <p>{AESTHETICS.find(a => a.id === selectedAesthetic)?.description}</p>
              </div>
            )}

            <button
              onClick={handleGenerateMoodboard}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isGenerating ? 'Generating Moodboard...' : 'Generate Moodboard'}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                setUploadedImage(null)
                setUploadedFile(null)
                setSelectedAesthetic('')
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Change image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

