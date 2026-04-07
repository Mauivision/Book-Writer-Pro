'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  FaBook,
  FaMagic,
  FaRocket,
  FaLightbulb,
  FaUser,
  FaMap,
  FaStar,
  FaPlus,
} from 'react-icons/fa';

export function WelcomeScreen() {
  const [showBookCreator, setShowBookCreator] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookGenre, setBookGenre] = useState('');
  const [bookDescription, setBookDescription] = useState('');

  const { createBook, metadata } = useBookStore();

  const handleCreateBook = () => {
    if (bookTitle.trim()) {
      createBook({
        title: bookTitle,
        genre: bookGenre,
        description: bookDescription,
        author: 'You',
        genres: bookGenre ? [bookGenre] : [],
        targetAudience: 'General',
        wordCountGoal: 80000,
        currentWordCount: 0,
        status: 'draft',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      });
      setShowBookCreator(false);
      setBookTitle('');
      setBookGenre('');
      setBookDescription('');
    }
  };

  if (metadata.title) {
    return null; // Don't show welcome screen if book exists
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <FaBook className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to NovelCraft AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered writing companion for creating amazing stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <FaMagic className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Writing Assistant</h3>
            <p className="text-gray-600">
              Get intelligent suggestions, character development, and plot ideas
            </p>
          </Card>

          <Card className="p-6 text-center">
            <FaRocket className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Voice Dictation</h3>
            <p className="text-gray-600">
              Speak your story and watch it come to life with voice recognition
            </p>
          </Card>

          <Card className="p-6 text-center">
            <FaLightbulb className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Organization</h3>
            <p className="text-gray-600">
              Keep track of characters, plot points, and chapter progress
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setShowBookCreator(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <FaPlus className="mr-2" />
            Start Writing Your Book
          </Button>

          <p className="text-gray-500 text-sm">
            Create your first book to begin your writing journey
          </p>
        </div>

        {showBookCreator && (
          <Card className="mt-8 p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Create Your Book</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Title
                </label>
                <Input
                  value={bookTitle}
                  onChange={e => setBookTitle(e.target.value)}
                  placeholder="Enter your book title..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <Input
                  value={bookGenre}
                  onChange={e => setBookGenre(e.target.value)}
                  placeholder="e.g., Science Fiction, Fantasy, Romance..."
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={bookDescription}
                  onChange={e => setBookDescription(e.target.value)}
                  placeholder="Brief description of your story..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCreateBook}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Create Book
                </Button>
                <Button
                  onClick={() => setShowBookCreator(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
