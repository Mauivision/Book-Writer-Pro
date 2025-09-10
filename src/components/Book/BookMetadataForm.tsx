'use client';

import { useState } from 'react'
import { useBookStore } from '@/store/useBookStore'
import type { BookMetadata } from '@/types'

export default function BookMetadataForm() {
  const { metadata, updateMetadata } = useBookStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<BookMetadata>(metadata)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMetadata(formData)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book Information</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{metadata.title}</h3>
            <p className="text-gray-600">by {metadata.author}</p>
          </div>
          {metadata.genre && (
            <div>
              <span className="text-sm font-medium text-gray-500">Genre:</span>
              <span className="ml-2">{metadata.genre}</span>
            </div>
          )}
          {metadata.targetAudience && (
            <div>
              <span className="text-sm font-medium text-gray-500">Target Audience:</span>
              <span className="ml-2">{metadata.targetAudience}</span>
            </div>
          )}
          {metadata.synopsis && (
            <div>
              <span className="text-sm font-medium text-gray-500">Synopsis:</span>
              <p className="mt-1 text-gray-600">{metadata.synopsis}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Genre</label>
          <input
            type="text"
            value={formData.genre || ''}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Audience</label>
          <input
            type="text"
            value={formData.targetAudience || ''}
            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Synopsis</label>
          <textarea
            value={formData.synopsis || ''}
            onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setFormData(metadata)
              setIsEditing(false)
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  )
} 