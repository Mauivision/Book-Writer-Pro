'use client';

import { useState } from 'react'
import { useBookStore } from '@/store/bookStore'
import { apiClient, ApiError } from '@/utils/apiClient'
import { motion } from 'framer-motion'
import { FaMagic, FaSpinner, FaCog } from 'react-icons/fa'

interface StoryGeneratorProps {
  onComplete?: () => void
}

export default function StoryGenerator({ onComplete }: StoryGeneratorProps) {
  const { generateCompleteStory, metadata } = useBookStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  
  // Story generation parameters
  const [storyParams, setStoryParams] = useState({
    genre: metadata.genres[0] || 'Fantasy',
    theme: metadata.description || 'Adventure',
    complexity: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    length: 'medium' as 'short' | 'medium' | 'long',
    customPrompt: ''
  })

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      setProgress(0)
      setStatus('Initializing story generation...')

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      await generateCompleteStory({
        genre: storyParams.genre,
        theme: storyParams.theme,
        complexity: storyParams.complexity,
        length: storyParams.length,
      })

      clearInterval(progressInterval)
      setProgress(100)
      setStatus('Story generated successfully!')
      
      setTimeout(() => {
        setProgress(0)
        setStatus('')
        onComplete?.()
      }, 2000)

    } catch (err) {
      let errorMessage = 'Failed to generate story'
      
      if (err instanceof ApiError) {
        errorMessage = err.message
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setStatus('Generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const updateStoryParams = (field: string, value: string) => {
    setStoryParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="bg-background rounded-lg shadow-md p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaMagic className="text-primary text-xl" />
          <h2 className="text-2xl font-bold text-foreground">Story Generator</h2>
        </div>
        <motion.button
          onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaCog />
          Configure
        </motion.button>
      </div>
      
      <p className="text-secondary mb-6">
        Generate a complete story using your book's metadata and custom parameters.
      </p>

      {/* Configuration Panel */}
      {showConfig && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-secondary/10 rounded-lg space-y-4"
        >
          <h3 className="font-medium text-foreground">Story Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Genre
              </label>
              <input
                type="text"
                value={storyParams.genre}
                onChange={(e) => updateStoryParams('genre', e.target.value)}
                placeholder="Fantasy, Sci-Fi, Romance..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Theme
              </label>
              <input
                type="text"
                value={storyParams.theme}
                onChange={(e) => updateStoryParams('theme', e.target.value)}
                placeholder="Adventure, Love, Redemption..."
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Complexity
              </label>
              <select
                value={storyParams.complexity}
                onChange={(e) => updateStoryParams('complexity', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Length
              </label>
              <select
                value={storyParams.length}
                onChange={(e) => updateStoryParams('length', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Custom Prompt (Optional)
            </label>
            <textarea
              value={storyParams.customPrompt}
              onChange={(e) => updateStoryParams('customPrompt', e.target.value)}
              placeholder="Add any specific requirements or ideas for your story..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
            />
          </div>
        </motion.div>
      )}

      {/* Current Book Info */}
      <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h3 className="font-medium text-foreground mb-2">Current Book Info</h3>
        <div className="text-sm text-secondary space-y-1">
          <p><strong>Title:</strong> {metadata.title || 'Untitled'}</p>
          <p><strong>Author:</strong> {metadata.author || 'Unknown'}</p>
          <p><strong>Genres:</strong> {metadata.genres.join(', ') || 'None specified'}</p>
          <p><strong>Description:</strong> {metadata.description || 'No description'}</p>
        </div>
      </div>

      <div className="mb-6">
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:bg-secondary/20 disabled:cursor-not-allowed flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FaMagic />
              Generate Story
            </>
          )}
        </motion.button>
      </div>

      {isGenerating && (
        <div className="space-y-3">
          <div className="w-full bg-secondary/20 rounded-full h-3">
            <motion.div
              className="bg-primary h-3 rounded-full transition-all duration-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-secondary">{status}</p>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <p className="text-destructive text-sm">{error}</p>
        </motion.div>
      )}

      {!isGenerating && !error && (
        <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
          <h3 className="font-medium text-foreground mb-2">What you'll get:</h3>
          <ul className="text-sm text-secondary space-y-1">
            <li>• Complete story outline and synopsis</li>
            <li>• Main characters with backgrounds and motivations</li>
            <li>• Detailed plot structure</li>
            <li>• Rich setting description</li>
            <li>• Initial chapters to get you started</li>
          </ul>
        </div>
      )}
    </div>
  )
} 