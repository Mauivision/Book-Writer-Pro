'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaBook, 
  FaUser, 
  FaEdit, 
  FaMagic,
  FaPlus,
  FaStar,
  FaMap,
  FaRocket
} from 'react-icons/fa';

interface BookCreatorProps {
  onBookCreated: () => void;
}

export default function BookCreator({ onBookCreated }: BookCreatorProps) {
  const { updateMetadata, addChapter, addCharacter, updatePlot } = useBookStore();
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: 'Fantasy',
    targetAudience: 'Young Adult',
    wordCountGoal: 80000,
    synopsis: '',
    themes: ['Adventure', 'Discovery'],
    setting: ''
  });

  const [step, setStep] = useState(1);

  const handleCreateBook = () => {
    if (!bookData.title.trim() || !bookData.author.trim()) {
      alert('Please fill in the book title and author name');
      return;
    }

    // Update metadata
    updateMetadata({
      title: bookData.title,
      author: bookData.author,
      genre: bookData.genre,
      targetAudience: bookData.targetAudience,
      wordCountGoal: bookData.wordCountGoal,
      synopsis: bookData.synopsis,
      themes: bookData.themes,
      setting: bookData.setting,
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    // Add initial plot
    updatePlot({
      summary: bookData.synopsis || 'A compelling story waiting to be written.',
      outline: [
        'Introduction and setup',
        'Rising action and conflict',
        'Climax and resolution',
        'Conclusion and aftermath'
      ]
    });

    // Add first chapter
    addChapter({
      title: 'Chapter 1: The Beginning',
      content: '',
      summary: 'The opening chapter of your story',
      order: 1,
      status: 'draft',
      wordCount: 0
    });

    // Add main character
    addCharacter({
      name: 'Main Character',
      role: 'protagonist',
      description: 'The central character of your story',
      background: 'To be developed as the story progresses',
      motivations: ['To be discovered through the story'],
      relationships: []
    });

    onBookCreated();
  };

  const genres = [
    'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller', 
    'Horror', 'Historical Fiction', 'Contemporary', 'Young Adult', 
    'Children\'s', 'Non-Fiction', 'Biography', 'Self-Help', 'Business'
  ];

  const audiences = [
    'Children', 'Young Adult', 'Adult', 'General', 'Academic', 'Professional'
  ];

  const themes = [
    'Adventure', 'Discovery', 'Love', 'Loss', 'Redemption', 'Power', 
    'Justice', 'Family', 'Friendship', 'Betrayal', 'Courage', 'Fear',
    'Growth', 'Transformation', 'Identity', 'Belonging'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <FaBook className="text-blue-600" />
          Create Your New Book
        </h1>
        <p className="text-lg text-gray-600">
          Let's start your writing journey with a new book project
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                step >= stepNumber ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaEdit className="text-blue-500" />
              Basic Book Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <Input
                  value={bookData.title}
                  onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
                  placeholder="Enter your book title..."
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author Name *
                </label>
                <Input
                  value={bookData.author}
                  onChange={(e) => setBookData({ ...bookData, author: e.target.value })}
                  placeholder="Your name..."
                  className="text-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={bookData.genre}
                  onChange={(e) => setBookData({ ...bookData, genre: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <select
                  value={bookData.targetAudience}
                  onChange={(e) => setBookData({ ...bookData, targetAudience: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-md"
                >
                  {audiences.map((audience) => (
                    <option key={audience} value={audience}>{audience}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Word Count Goal
              </label>
              <select
                value={bookData.wordCountGoal}
                onChange={(e) => setBookData({ ...bookData, wordCountGoal: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value={50000}>50,000 words (Novella)</option>
                <option value={80000}>80,000 words (Novel)</option>
                <option value={100000}>100,000 words (Long Novel)</option>
                <option value={150000}>150,000 words (Epic)</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!bookData.title.trim() || !bookData.author.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaMap className="text-green-500" />
              Story Details
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Synopsis
              </label>
              <textarea
                value={bookData.synopsis}
                onChange={(e) => setBookData({ ...bookData, synopsis: e.target.value })}
                placeholder="Brief summary of your story..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setting
              </label>
              <textarea
                value={bookData.setting}
                onChange={(e) => setBookData({ ...bookData, setting: e.target.value })}
                placeholder="Where and when does your story take place?"
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Themes
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {themes.map((theme) => (
                  <label key={theme} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={bookData.themes.includes(theme)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setBookData({ 
                            ...bookData, 
                            themes: [...bookData.themes, theme] 
                          });
                        } else {
                          setBookData({ 
                            ...bookData, 
                            themes: bookData.themes.filter(t => t !== theme) 
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="px-6 py-3"
              >
                Previous
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaRocket className="text-purple-500" />
              Ready to Create
            </h2>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {bookData.title}</p>
                <p><strong>Author:</strong> {bookData.author}</p>
                <p><strong>Genre:</strong> {bookData.genre}</p>
                <p><strong>Target Audience:</strong> {bookData.targetAudience}</p>
                <p><strong>Word Count Goal:</strong> {bookData.wordCountGoal.toLocaleString()} words</p>
                <p><strong>Themes:</strong> {bookData.themes.join(', ')}</p>
                {bookData.synopsis && (
                  <p><strong>Synopsis:</strong> {bookData.synopsis}</p>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                This will create your book with an initial chapter and main character. 
                You can start writing immediately!
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="px-6 py-3"
              >
                Previous
              </Button>
              <Button
                onClick={handleCreateBook}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg"
              >
                <FaMagic className="mr-2" />
                Create My Book
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 