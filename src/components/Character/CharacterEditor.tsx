'use client';

import { useState, useEffect } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaEye, 
  FaTrash,
  FaUser,
  FaHeart,
  FaBrain,
  FaUsers,
  FaPlus
} from 'react-icons/fa';

interface CharacterEditorProps {
  characterId?: string;
  onClose: () => void;
  onSave: (character: any) => void;
}

export default function CharacterEditor({ characterId, onClose, onSave }: CharacterEditorProps) {
  const { characters, updateCharacter, removeCharacter } = useBookStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState<'protagonist' | 'antagonist' | 'supporting' | 'minor'>('supporting');
  const [description, setDescription] = useState('');
  const [background, setBackground] = useState('');
  const [motivations, setMotivations] = useState<string[]>(['']);
  const [relationships, setRelationships] = useState<any[]>([]);

  const character = characterId ? characters.find(c => c.id === characterId) : null;

  useEffect(() => {
    if (character) {
      setName(character.name);
      setRole(character.role);
      setDescription(character.description);
      setBackground(character.background || '');
      setMotivations(character.motivations || ['']);
      setRelationships(character.relationships || []);
    }
  }, [character]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a character name');
      return;
    }

    const updatedCharacter = {
      id: characterId || Date.now().toString(),
      name: name.trim(),
      role,
      description: description.trim(),
      background: background.trim(),
      motivations: motivations.filter(m => m.trim()),
      relationships
    };

    if (characterId) {
      updateCharacter(characterId, updatedCharacter);
    } else {
      onSave(updatedCharacter);
    }

    onClose();
  };

  const handleDelete = () => {
    if (characterId && confirm('Are you sure you want to delete this character?')) {
      removeCharacter(characterId);
      onClose();
    }
  };

  const addMotivation = () => {
    setMotivations([...motivations, '']);
  };

  const updateMotivation = (index: number, value: string) => {
    const newMotivations = [...motivations];
    newMotivations[index] = value;
    setMotivations(newMotivations);
  };

  const removeMotivation = (index: number) => {
    setMotivations(motivations.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaUser className="text-purple-500 text-xl" />
            <h2 className="text-xl font-semibold text-gray-900">
              {characterId ? 'Edit Character' : 'New Character'}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <FaTimes />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name..."
                className="text-lg"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="protagonist">Protagonist</option>
                <option value="antagonist">Antagonist</option>
                <option value="supporting">Supporting</option>
                <option value="minor">Minor</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the character's appearance, personality, and key traits..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
              />
            </div>

            {/* Background */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background
              </label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Character's history, upbringing, and past experiences..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={4}
              />
            </div>

            {/* Motivations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivations
              </label>
              <div className="space-y-2">
                {motivations.map((motivation, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={motivation}
                      onChange={(e) => updateMotivation(index, e.target.value)}
                      placeholder="What drives this character?"
                      className="flex-1"
                    />
                    {motivations.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMotivation(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FaTrash />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMotivation}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FaPlus className="mr-1" />
                  Add Motivation
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            {characterId && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <FaTrash className="mr-1" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <FaSave className="mr-1" />
              Save Character
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 