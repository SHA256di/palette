'use client'

import React, { useState } from 'react'

export type LayoutType = 'wishlist' | 'perfume' | 'collage'

interface LayoutOption {
  value: LayoutType
  label: string
  description: string
  preview?: string
}

interface LayoutSelectorProps {
  selectedLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
  className?: string
}

const layoutOptions: LayoutOption[] = [
  {
    value: 'wishlist',
    label: 'Wishlist',
    description: '2×2 grid with captions - perfect for curated items',
    preview: '□ □\n□ □'
  },
  {
    value: 'perfume',
    label: 'Perfume Notes',
    description: 'Top, middle & base notes - tells a story through layers',
    preview: '○ ○ ○ ○\n○ ○ ○ ○\n○ ○ ○ ○'
  },
  {
    value: 'collage',
    label: 'Collage',
    description: 'Masonry layout - dynamic and artistic arrangement',
    preview: '■■ □ □\n■■ □ □\n□ □ ■■'
  }
]

export default function LayoutSelector({ selectedLayout, onLayoutChange, className = '' }: LayoutSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = layoutOptions.find(option => option.value === selectedLayout)

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Layout Style
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-left cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">
                {selectedOption?.label}
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {selectedOption?.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {selectedOption?.preview && (
                <div className="text-xs text-gray-400 font-mono whitespace-pre leading-none">
                  {selectedOption.preview}
                </div>
              )}
              <svg 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onLayoutChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    selectedLayout === option.value ? 'bg-gray-50 ring-1 ring-gray-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                        {selectedLayout === option.value && (
                          <svg className="ml-2 h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {option.description}
                      </p>
                    </div>
                    
                    {option.preview && (
                      <div className="ml-4 text-xs text-gray-400 font-mono whitespace-pre leading-none">
                        {option.preview}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}