'use client'

import { useState } from 'react'
import LayoutSelector, { LayoutType } from '../../components/LayoutSelector'
import WishlistLayout from '../../components/WishlistLayout'
import PerfumeLayout from '../../components/PerfumeLayout'
import CollageLayout from '../../components/CollageLayout'

// Mock data for testing
const mockData = {
  vibe: 'ethereal grunge',
  originalImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
  originalImageName: 'vintage leather jacket',
  films: [
    { title: 'Donnie Darko', director: 'Richard Kelly', poster_url: 'https://images.unsplash.com/photo-1489599735734-79b4f68628e8?w=300&h=450&fit=crop' },
    { title: 'Girl, Interrupted', director: 'James Mangold', poster_url: 'https://images.unsplash.com/photo-1512389098783-66b81f86e199?w=300&h=450&fit=crop' },
    { title: 'The Virgin Suicides', director: 'Sofia Coppola', poster_url: 'https://images.unsplash.com/photo-1554048612-b6ebf5d65789?w=300&h=450&fit=crop' },
  ],
  albums: [
    { name: 'Nevermind', artist: 'Nirvana', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
    { name: 'In Utero', artist: 'Nirvana', image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop' },
    { name: 'Siamese Dream', artist: 'Smashing Pumpkins', image: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=300&h=300&fit=crop' },
  ],
  aestheticImages: [
    { url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=300&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=300&h=300&fit=crop' },
    { url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=300&fit=crop' },
  ],
  quotes: [
    { text: 'embrace the darkness', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop' },
    { text: 'beautiful chaos', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop' },
  ]
}

export default function TestLayoutsPage() {
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('wishlist')

  const renderSelectedLayout = () => {
    const layoutProps = mockData

    switch (selectedLayout) {
      case 'wishlist':
        return <WishlistLayout {...layoutProps} />
      case 'perfume':
        return <PerfumeLayout {...layoutProps} />
      case 'collage':
        return <CollageLayout {...layoutProps} />
      default:
        return <WishlistLayout {...layoutProps} />
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Layout Testing
          </h1>
          <p className="text-lg text-gray-600">
            Test the different moodboard layouts with mock data
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <LayoutSelector 
            selectedLayout={selectedLayout}
            onLayoutChange={setSelectedLayout}
            className="max-w-md mx-auto"
          />
        </div>

        <div className="space-y-8">
          {renderSelectedLayout()}
        </div>

        {/* Mock data info */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mock Data Used:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Vibe:</strong> {mockData.vibe}</p>
            <p><strong>Films:</strong> {mockData.films.length} movies</p>
            <p><strong>Albums:</strong> {mockData.albums.length} albums</p>
            <p><strong>Aesthetic Images:</strong> {mockData.aestheticImages.length} images</p>
            <p><strong>Quotes:</strong> {mockData.quotes.length} quotes</p>
          </div>
        </div>
      </div>
    </main>
  )
}