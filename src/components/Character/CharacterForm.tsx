'use client';

import { useState } from 'react'
import { useBookStore } from '@/store/useBookStore'
import { Character } from '@/types'
import { generateCharacterName } from '@/utils/nameGenerator'
import {
  attachProviderConfig,
  getAIAuthToken,
  getClientAIProviderConfig,
} from '@/utils/clientAIRequest'

// Types
type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'minor'

interface CharacterFormProps {
  characterId?: string
  onClose: () => void
}

interface CharacterFormData {
  name: string
  role: CharacterRole
  description: string
  background: string
  motivations: string[]
  relationships: Array<{
    characterId: string
    type: string
  }>
}

export default function CharacterForm({ characterId, onClose }: CharacterFormProps) {
  // Store and state
  const { characters, addCharacter, updateCharacter, addRelationship, removeRelationship, generateCharacterIdeas } = useBookStore()
  const character = characterId ? characters.find(c => c.id === characterId) : null

  const [formData, setFormData] = useState<CharacterFormData>({
    name: character?.name || '',
    role: (character?.role as CharacterRole) || 'supporting',
    description: character?.description || '',
    background: character?.background || '',
    motivations: character?.motivations || [],
    relationships: character?.relationships || []
  })

  const [newRelationship, setNewRelationship] = useState({
    characterId: '',
    type: ''
  })

  const [isGenerating, setIsGenerating] = useState(false)

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (characterId) {
      updateCharacter(characterId, formData)
    } else {
      addCharacter(formData)
    }
    onClose()
  }

  const handleGenerateCharacter = async () => {
    try {
      setIsGenerating(true)
      const generatedName = generateCharacterName()
      const providerConfig = getClientAIProviderConfig()
      const response = await fetch('/api/ai/generate-characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAIAuthToken(providerConfig)}`,
        },
        body: JSON.stringify(attachProviderConfig({
          role: formData.role,
          existingCharacters: characters,
          name: generatedName
        }))
      })

      if (!response.ok) {
        throw new Error('Failed to generate character')
      }

      const data = await response.json()
      const generatedCharacter = data.characters[0]

      setFormData(prev => ({
        ...prev,
        name: generatedName,
        description: generatedCharacter.description,
        background: generatedCharacter.background,
        personality: generatedCharacter.personality,
        goals: generatedCharacter.goals,
        relationships: prev.relationships // Preserve existing relationships
      }))
    } catch (error) {
      console.error('Error generating character:', error)
      alert('Failed to generate character. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddRelationship = () => {
    if (newRelationship.characterId && newRelationship.type) {
      if (characterId) {
        addRelationship(characterId, newRelationship.characterId, newRelationship.type)
      }
      setFormData(prev => ({
        ...prev,
        relationships: [...prev.relationships, newRelationship]
      }))
      setNewRelationship({ characterId: '', type: '' })
    }
  }

  const handleRemoveRelationship = (index: number) => {
    if (characterId) {
      const relationship = formData.relationships[index]
      removeRelationship(characterId, relationship.characterId)
      setFormData(prev => ({
        ...prev,
        relationships: prev.relationships.filter((_, i) => i !== index)
      }))
    }
  }

  // Render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {characterId ? 'Edit Character' : 'Add New Character'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Generate */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateCharacter}
              disabled={isGenerating}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as CharacterRole })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="protagonist">Protagonist</option>
              <option value="antagonist">Antagonist</option>
              <option value="supporting">Supporting Character</option>
              <option value="minor">Minor Character</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Background */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Background</label>
            <textarea
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Motivations */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Motivations</label>
            <div className="mt-1 space-y-2">
              {formData.motivations.map((motivation, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={motivation}
                    onChange={(e) => {
                      const newMotivations = [...formData.motivations]
                      newMotivations[index] = e.target.value
                      setFormData({ ...formData, motivations: newMotivations })
                    }}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newMotivations = formData.motivations.filter((_, i) => i !== index)
                      setFormData({ ...formData, motivations: newMotivations })
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, motivations: [...prev.motivations, ''] }))}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Motivation
              </button>
            </div>
          </div>

          {/* Relationships */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Relationships</h3>
            
            {/* Existing Relationships */}
            {formData.relationships.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Relationships</h4>
                <div className="space-y-2">
                  {formData.relationships.map((relationship, index) => {
                    const targetChar = characters.find(c => c.id === relationship.characterId)
                    return (
                      <div key={relationship.characterId} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{targetChar?.name} - {relationship.type}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRelationship(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add New Relationship */}
            <div className="flex space-x-2">
              <select
                value={newRelationship.characterId}
                onChange={(e) => setNewRelationship(prev => ({ ...prev, characterId: e.target.value }))}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Character</option>
                {characters
                  .filter(c => c.id !== characterId)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </select>
              <input
                type="text"
                value={newRelationship.type}
                onChange={(e) => setNewRelationship(prev => ({ ...prev, type: e.target.value }))}
                placeholder="Relationship type"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddRelationship}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {characterId ? 'Update' : 'Create'} Character
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 