'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaLightbulb, 
  FaBrain, 
  FaRocket, 
  FaBook, 
  FaUsers, 
  FaMap,
  FaArrowRight
} from 'react-icons/fa';

interface IdeaStageProps {
  onComplete: (idea: {
    concept: string;
    genre: string;
    targetAudience: string;
    uniqueElements: string[];
    hook: string;
  }) => void;
  onBack: () => void;
}

export default function IdeaStage({ onComplete, onBack }: IdeaStageProps) {
  const [concept, setConcept] = useState('');
  const [genre, setGenre] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [uniqueElements, setUniqueElements] = useState<string[]>([]);
  const [newElement, setNewElement] = useState('');
  const [hook, setHook] = useState('');

  const genres = [
    'Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller',
    'Historical Fiction', 'Contemporary', 'Literary Fiction', 'Young Adult',
    'Children\'s', 'Horror', 'Adventure', 'Drama', 'Comedy'
  ];

  const addUniqueElement = () => {
    if (newElement.trim() && !uniqueElements.includes(newElement.trim())) {
      setUniqueElements([...uniqueElements, newElement.trim()]);
      setNewElement('');
    }
  };

  const removeUniqueElement = (index: number) => {
    setUniqueElements(uniqueElements.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (concept && genre && targetAudience && uniqueElements.length > 0 && hook) {
      onComplete({
        concept,
        genre,
        targetAudience,
        uniqueElements,
        hook
      });
    }
  };

  const isComplete = concept && genre && targetAudience && uniqueElements.length > 0 && hook;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaLightbulb className="text-yellow-600 text-3xl" />
        </div>
        <h2 className="text-3xl font-bold text-mint-900 mb-2">Idea & Concept Development</h2>
        <p className="text-mint-600">Let's develop your story idea into a compelling concept</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Story Concept */}
        <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-mint-900">
            <FaBook className="text-blue-400" />
            Your Story Concept
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-2">
                What's your story about? *
              </label>
              <textarea
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your story idea in 2-3 sentences..."
                className="w-full p-3 border-2 border-mint-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                rows={4}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-2">
                Genre *
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full p-3 border-2 border-mint-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <option value="">Select a genre</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Target Audience & Unique Elements */}
        <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-mint-900">
            <FaUsers className="text-purple-400" />
            Audience & Uniqueness
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-2">
                Target Audience *
              </label>
              <Input
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g., Young adults, Fantasy readers, Mystery lovers..."
                className="border-2 border-mint-200 focus:border-purple-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-mint-700 mb-2">
                What makes your story unique? *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newElement}
                    onChange={(e) => setNewElement(e.target.value)}
                    placeholder="Add a unique element..."
                    className="flex-1 border-2 border-mint-200 focus:border-purple-300"
                    onKeyPress={(e) => e.key === 'Enter' && addUniqueElement()}
                  />
                  <Button
                    onClick={addUniqueElement}
                    className="bg-purple-200 hover:bg-purple-300 text-purple-900 border border-purple-200"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                
                {uniqueElements.length > 0 && (
                  <div className="space-y-2">
                    {uniqueElements.map((element, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                        <span className="text-sm text-purple-700 flex-1">{element}</span>
                        <Button
                          onClick={() => removeUniqueElement(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                          variant="ghost"
                          size="sm"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Story Hook */}
      <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-mint-900">
          <FaRocket className="text-orange-400" />
          Your Story Hook
        </h3>
        <div>
          <label className="block text-sm font-medium text-mint-700 mb-2">
            What's the compelling hook that will grab readers? *
          </label>
          <textarea
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="Write a compelling one-sentence hook that makes readers want to know more..."
            className="w-full p-3 border-2 border-mint-200 rounded-lg focus:border-orange-300 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
            rows={3}
          />
          <p className="text-sm text-mint-500 mt-2">
            This should be the "elevator pitch" that makes someone immediately interested in your story.
          </p>
        </div>
      </Card>

      {/* AI Brainstorming */}
      <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-mint-900">
          <FaBrain className="text-pink-400" />
          AI Brainstorming Assistant
        </h3>
        <p className="text-mint-600 mb-4">
          Need help developing your idea? Our AI can help you brainstorm concepts, explore genres, and refine your hook.
        </p>
        <Button
          className="bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-mint-900 border border-pink-200"
        >
          <FaBrain className="mr-2" />
          Get AI Help
        </Button>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="border-mint-200 text-mint-700 hover:border-mint-300"
        >
          ← Back
        </Button>
        
        <Button
          onClick={handleComplete}
          disabled={!isComplete}
          className="bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 text-mint-900 border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Idea Stage
          <FaArrowRight className="ml-2" />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-mint-100 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-mint-700">Idea Stage</span>
          <FaArrowRight className="text-mint-400" />
          <span className="text-sm text-mint-500">Planning Stage</span>
        </div>
      </div>
    </div>
  );
}
