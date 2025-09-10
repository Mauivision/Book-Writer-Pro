'use client';

import { useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  FaTimes, 
  FaBook, 
  FaUser, 
  FaMap, 
  FaSave,
  FaSpinner
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'chapter' | 'character' | 'plot';
}

export default function QuickAddModal({ isOpen, onClose, type }: QuickAddModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    role: 'supporting',
    background: '',
    motivations: [] as string[],
    motivation: ''
  });

  const { addChapter, addCharacter, updatePlot } = useBookStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      switch (type) {
        case 'chapter':
          addChapter({
            title: formData.title,
            content: formData.content,
            summary: formData.description,
            wordCount: formData.content.split(/\s+/).length,
            order: 0,
            status: 'draft'
          });
          toast.success('Chapter added successfully!');
          break;

        case 'character':
          addCharacter({
            name: formData.title,
            role: formData.role as 'protagonist' | 'antagonist' | 'supporting' | 'minor',
            description: formData.description,
            background: formData.background,
            motivations: formData.motivations,
            relationships: []
          });
          toast.success('Character added successfully!');
          break;

        case 'plot':
          // For plot points, we'll add to the existing plot outline
          const currentPlot = useBookStore.getState().plot;
          const newOutline = [...(currentPlot.outline || []), formData.title];
          updatePlot({
            summary: currentPlot.summary,
            outline: newOutline
          });
          toast.success('Plot point added successfully!');
          break;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        content: '',
        role: 'supporting',
        background: '',
        motivations: [],
        motivation: ''
      });
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMotivation = () => {
    if (formData.motivation.trim()) {
      setFormData(prev => ({
        ...prev,
        motivations: [...prev.motivations, prev.motivation.trim()],
        motivation: ''
      }));
    }
  };

  const removeMotivation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      motivations: prev.motivations.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (type) {
      case 'chapter': return 'Add New Chapter';
      case 'character': return 'Add New Character';
      case 'plot': return 'Add Plot Point';
      default: return 'Add Item';
    }
  };

  const getModalIcon = () => {
    switch (type) {
      case 'chapter': return <FaBook className="text-blue-500" />;
      case 'character': return <FaUser className="text-purple-500" />;
      case 'plot': return <FaMap className="text-green-500" />;
      default: return <FaBook className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {getModalIcon()}
            {getModalTitle()}
          </h2>
          <Button
            onClick={onClose}
            variant="outline"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title/Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'chapter' ? 'Chapter Title' : 
               type === 'character' ? 'Character Name' : 'Plot Point'}
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={
                type === 'chapter' ? 'Enter chapter title...' :
                type === 'character' ? 'Enter character name...' :
                'Enter plot point...'
              }
              required
            />
          </div>

          {/* Description/Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'chapter' ? 'Chapter Summary' : 
               type === 'character' ? 'Character Description' : 'Description'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={
                type === 'chapter' ? 'Brief summary of the chapter...' :
                type === 'character' ? 'Describe the character...' :
                'Describe this plot point...'
              }
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Character-specific fields */}
          {type === 'character' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Character Role
                </label>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  options={[
                    { value: 'protagonist', label: 'Protagonist' },
                    { value: 'antagonist', label: 'Antagonist' },
                    { value: 'supporting', label: 'Supporting Character' },
                    { value: 'minor', label: 'Minor Character' }
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background
                </label>
                <textarea
                  value={formData.background}
                  onChange={(e) => setFormData(prev => ({ ...prev, background: e.target.value }))}
                  placeholder="Character's background and history..."
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivations
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    placeholder="Add a motivation..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMotivation())}
                  />
                  <Button
                    type="button"
                    onClick={addMotivation}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                {formData.motivations.length > 0 && (
                  <div className="space-y-1">
                    {formData.motivations.map((motivation, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="text-sm flex-1">{motivation}</span>
                        <Button
                          type="button"
                          onClick={() => removeMotivation(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes className="text-xs" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Chapter-specific fields */}
          {type === 'chapter' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chapter Content (Optional)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Start writing your chapter content..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can add content now or write it later in the editor.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Add {type === 'chapter' ? 'Chapter' : type === 'character' ? 'Character' : 'Plot Point'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 