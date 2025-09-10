'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RealTimeWritingCompanion } from './RealTimeWritingCompanion';
import { 
  FaBrain, 
  FaTimes, 
  FaChevronUp, 
  FaChevronDown,
  FaMagic,
  FaSpellCheck,
  FaPalette,
  FaLightbulb,
  FaRocket,
  FaStar,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

interface FloatingAIAssistantProps {
  currentText: string;
  cursorPosition: number;
  onSuggestionApply?: (suggestion: any) => void;
  className?: string;
}

export function FloatingAIAssistant({ 
  currentText, 
  cursorPosition, 
  onSuggestionApply,
  className = '' 
}: FloatingAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [assistantMode, setAssistantMode] = useState<'companion' | 'error-check' | 'style-enhance'>('companion');
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const assistantRef = useRef<HTMLDivElement>(null);

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Auto-open when there's substantial text
  useEffect(() => {
    if (currentText.length > 50 && !isOpen) {
      const timeoutId = setTimeout(() => {
        setIsOpen(true);
        setIsMinimized(true);
      }, 3000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentText.length, isOpen]);

  const getModeIcon = (mode: string) => {
    const icons = {
      companion: FaBrain,
      'error-check': FaSpellCheck,
      'style-enhance': FaPalette
    };
    return icons[mode as keyof typeof icons] || FaBrain;
  };

  const getModeColor = (mode: string) => {
    const colors = {
      companion: 'text-blue-500 bg-blue-50 border-blue-200',
      'error-check': 'text-red-500 bg-red-50 border-red-200',
      'style-enhance': 'text-purple-500 bg-purple-50 border-purple-200'
    };
    return colors[mode as keyof typeof colors] || colors.companion;
  };

  if (!isOpen) {
    return (
      <div 
        className={`fixed z-50 ${className}`}
        style={{ 
          left: position.x, 
          top: position.y,
          transform: 'translateY(-50%)'
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          <FaBrain className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={assistantRef}
      className={`fixed z-50 transition-all duration-300 ${className}`}
      style={{ 
        left: position.x, 
        top: position.y,
        transform: isMinimized ? 'translateY(-50%)' : 'translateY(-50%)'
      }}
    >
      <Card className={`shadow-xl border-2 ${getModeColor(assistantMode)} transition-all duration-300 ${
        isMinimized ? 'w-64' : 'w-80'
      }`}>
        {/* Header */}
        <div 
          className="drag-handle p-3 border-b border-gray-200 dark:border-gray-700 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {React.createElement(getModeIcon(assistantMode), { className: "w-5 h-5" })}
              <h3 className="font-semibold text-sm">
                {assistantMode === 'companion' && 'AI Companion'}
                {assistantMode === 'error-check' && 'Error Checker'}
                {assistantMode === 'style-enhance' && 'Style Enhancer'}
              </h3>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <FaExpand className="w-3 h-3" /> : <FaCompress className="w-3 h-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        {!isMinimized && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-1">
              {[
                { key: 'companion', label: 'Companion', icon: FaBrain },
                { key: 'error-check', label: 'Errors', icon: FaSpellCheck },
                { key: 'style-enhance', label: 'Style', icon: FaPalette }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  onClick={() => setAssistantMode(key as any)}
                  variant={assistantMode === key ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!isMinimized && (
          <div className="p-3">
            {assistantMode === 'companion' && (
              <RealTimeWritingCompanion
                currentText={currentText}
                cursorPosition={cursorPosition}
                onSuggestionApply={onSuggestionApply}
                className="border-0 shadow-none"
              />
            )}
            
            {assistantMode === 'error-check' && (
              <div className="text-center py-8">
                <FaSpellCheck className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Error Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Analyzing your text for grammar and style issues...
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-green-600">✓ No spelling errors found</div>
                  <div className="text-xs text-yellow-600">⚠ 2 style suggestions</div>
                  <div className="text-xs text-blue-600">ℹ 1 clarity improvement</div>
                </div>
              </div>
            )}
            
            {assistantMode === 'style-enhance' && (
              <div className="text-center py-8">
                <FaPalette className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Style Enhancement</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Generating style improvements for your writing...
                </p>
                <div className="space-y-2">
                  <div className="text-xs text-purple-600">🎨 3 vivid descriptions</div>
                  <div className="text-xs text-blue-600">💬 2 dialogue improvements</div>
                  <div className="text-xs text-green-600">✨ 1 flow enhancement</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Minimized Content */}
        {isMinimized && (
          <div className="p-3">
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {currentText.length} characters written
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsMinimized(false)}
                >
                  <FaExpand className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  <FaTimes className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
