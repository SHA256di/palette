'use client'

import { useState } from 'react'

export default function Home() {
  const [vibe, setVibe] = useState('')
  const [audience, setAudience] = useState('gen_z')
  const [platform, setPlatform] = useState('instagram')
  const [outputType, setOutputType] = useState('campaign_mockup')
  const [generatedBoard, setGeneratedBoard] = useState(false)

  const handleGenerateBoard = () => {
    if (!vibe.trim()) {
      alert('Please enter a vibe/aesthetic')
      return
    }
    setGeneratedBoard(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            palette
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered creative workflow curator that generates ready-to-use inspiration packs 
            with music, visuals, and cultural references for your campaigns and projects.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Create Your Inspiration Pack
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="vibe" className="block text-sm font-medium text-gray-700 mb-2">
                Vibe / Aesthetic *
              </label>
              <input
                type="text"
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. 'pink pilates princess', 'indie sleaze', 'coastal grandmother'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audience
                </label>
                <select 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gen_z">Gen Z</option>
                  <option value="millennials">Millennials</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform
                </label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['campaign_mockup', 'shoot_ideas', 'set_brief'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setOutputType(type)}
                    className={`px-4 py-3 border rounded-lg transition-colors ${
                      outputType === type
                        ? 'bg-purple-100 border-purple-300 text-purple-700'
                        : 'border-gray-300 hover:bg-purple-50 hover:border-purple-300'
                    }`}
                  >
                    {type.replace('_', ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleGenerateBoard}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Generate Inspiration Pack ✨
            </button>
          </div>
        </div>

        {generatedBoard && vibe && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Music & Playlist for "{vibe}"
              </h3>
              <p className="text-gray-600">
                Coming soon: Spotify integration for curated playlists based on your vibe
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Film & Media References
              </h3>
              <p className="text-gray-600">
                Coming soon: TMDb integration for film recommendations based on your vibe
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Moodboard & Visuals
              </h3>
              <p className="text-gray-600">
                Coming soon: Unsplash & Tumblr integration for aesthetic imagery
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Content & Strategy
              </h3>
              <p className="text-gray-600">
                Coming soon: AI-generated hashtags, post ideas, and campaign rationale for {audience} on {platform}
              </p>
            </div>
          </div>
        )}

        {!generatedBoard && (
          <div className="text-center text-gray-500 text-sm">
            <p>Start by entering your vibe and generating your first inspiration pack!</p>
          </div>
        )}
      </div>
    </main>
  )
}
