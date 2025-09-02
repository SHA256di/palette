'use client'

import React, { useState, useEffect } from 'react'
import MoodboardGenerator from './MoodboardGenerator'

interface MoodboardCollectorProps {
  vibe: string
  apiTags?: any // Enhanced API tags from aesthetic analysis
  originalImage?: string | null
  originalImageName?: string
  shouldGenerate?: boolean // Trigger from parent
}

export default function MoodboardCollector({ vibe, apiTags, originalImage, originalImageName, shouldGenerate = false }: MoodboardCollectorProps) {
  console.log('🎪 MoodboardCollector rendered with vibe:', vibe, 'apiTags:', !!apiTags)
  
  const [films, setFilms] = useState<any[]>([])
  const [albums, setAlbums] = useState<any[]>([])
  const [aestheticImages, setAestheticImages] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const collectAllContent = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🔄 Collecting all content with enhanced mappings:', !!apiTags)
      
      // Fetch all content types in parallel with enhanced API tags - limit to 3 each for beta
      const [filmsResponse, albumsResponse, imagesResponse] = await Promise.all([
        fetch('/api/films', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 3, apiTags })
        }),
        fetch('/api/album-covers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 3, apiTags })
        }),
        fetch('/api/aesthetic-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vibe, limit: 12, removeBackground: false, apiTags })
        })
      ])

      const [filmsData, albumsData, imagesData] = await Promise.all([
        filmsResponse.ok ? filmsResponse.json() : { films: [] },
        albumsResponse.ok ? albumsResponse.json() : { albumCovers: [] },
        imagesResponse.ok ? imagesResponse.json() : { images: [] }
      ])
      
      console.log('🔍 Raw API responses:', {
        filmsResponse: { ok: filmsResponse.ok, status: filmsResponse.status },
        albumsResponse: { ok: albumsResponse.ok, status: albumsResponse.status },
        imagesResponse: { ok: imagesResponse.ok, status: imagesResponse.status }
      })
      
      console.log('🔍 Raw API data:', {
        filmsData: JSON.stringify(filmsData).substring(0, 200),
        albumsData: JSON.stringify(albumsData).substring(0, 200),
        imagesData: JSON.stringify(imagesData).substring(0, 200)
      })

      console.log('📊 Content collected:', {
        films: filmsData.films?.length || 0,
        albums: albumsData.albumCovers?.length || 0,
        images: imagesData.images?.length || 0,
        quotes: imagesData.quotes?.length || 0
      })

      const newFilms = filmsData.films || []
      const newAlbums = albumsData.albumCovers || []
      const newImages = imagesData.images || []
      const newQuotes = imagesData.quotes || []
      
      console.log('🔄 Setting state with:', { films: newFilms.length, albums: newAlbums.length, images: newImages.length, quotes: newQuotes.length })
      
      setFilms(newFilms)
      setAlbums(newAlbums)
      setAestheticImages(newImages)
      setQuotes(newQuotes)

      console.log('✅ State updated with content')
      console.log(`📊 Final state: Films: ${newFilms.length}, Albums: ${newAlbums.length}, Images: ${newImages.length}, Quotes: ${newQuotes.length}`)
      console.log(`🎯 Should render MoodboardGenerator: ${newFilms.length > 0 || newAlbums.length > 0 || newImages.length > 0 || newQuotes.length > 0}`)
      
    } catch (err) {
      setError('Failed to collect content for moodboard')
      console.error('❌ Error collecting content:', err)
    } finally {
      setLoading(false)
      console.log('🔄 Loading finished, state before update:', { films: films.length, albums: albums.length, aestheticImages: aestheticImages.length })
    }
  }

  const totalContent = films.length + albums.length + aestheticImages.length

  // Manual collection - triggered by generate button, not auto
  const [hasCollected, setHasCollected] = React.useState(false)
  
  // Trigger collection when shouldGenerate becomes true
  React.useEffect(() => {
    if (shouldGenerate && vibe && vibe.trim() && !hasCollected && !loading) {
      console.log('🔄 Generate triggered - collecting content for vibe:', vibe)
      setHasCollected(true)
      collectAllContent()
    }
  }, [shouldGenerate, vibe, hasCollected, loading])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {loading && (
        <div className="flex justify-center mb-6">
          <div className="text-sm text-gray-500">collecting content...</div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {(films.length > 0 || albums.length > 0 || aestheticImages.length > 0 || quotes.length > 0) ? (
        <MoodboardGenerator
          vibe={vibe}
          films={films}
          albums={albums}
          aestheticImages={aestheticImages}
          quotes={quotes}
          originalImage={originalImage}
          originalImageName={originalImageName}
        />
      ) : !loading && (
        <div className="text-center text-gray-400 py-8">
          <p>generating your moodboard...</p>
        </div>
      )}
    </div>
  )
}