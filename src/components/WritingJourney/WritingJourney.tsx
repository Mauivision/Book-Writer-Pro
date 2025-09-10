'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FaLightbulb, 
  FaMap, 
  FaBook, 
  FaEdit, 
  FaRocket,
  FaCheck,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';
import IdeaStage from './IdeaStage';

interface WritingStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'not-started' | 'in-progress' | 'completed';
  component?: React.ComponentType<any>;
}

interface WritingJourneyProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function WritingJourney({ onComplete, onBack }: WritingJourneyProps) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [stageData, setStageData] = useState<Record<string, any>>({});

  const writingStages: WritingStage[] = [
    {
      id: 'idea',
      name: 'Idea & Concept',
      description: 'Develop your story idea',
      icon: <FaLightbulb className="text-yellow-500" />,
      status: 'in-progress',
      component: IdeaStage
    },
    {
      id: 'planning',
      name: 'Story Planning',
      description: 'Plot, characters, and setting',
      icon: <FaMap className="text-blue-500" />,
      status: 'not-started'
    },
    {
      id: 'writing',
      name: 'Writing',
      description: 'Create your chapters',
      icon: <FaBook className="text-green-500" />,
      status: 'not-started'
    },
    {
      id: 'revision',
      name: 'Revision',
      description: 'Edit and polish',
      icon: <FaEdit className="text-purple-500" />,
      status: 'not-started'
    },
    {
      id: 'publishing',
      name: 'Publishing',
      description: 'Export and publish',
      icon: <FaRocket className="text-orange-500" />,
      status: 'not-started'
    }
  ];

  const currentStage = writingStages[currentStageIndex];
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === writingStages.length - 1;

  const handleStageComplete = (data: any) => {
    // Save stage data
    setStageData(prev => ({
      ...prev,
      [currentStage.id]: data
    }));

    // Mark current stage as completed
    const updatedStages = [...writingStages];
    updatedStages[currentStageIndex].status = 'completed';
    
    // Move to next stage or complete journey
    if (isLastStage) {
      onComplete();
    } else {
      // Mark next stage as in-progress
      if (currentStageIndex + 1 < updatedStages.length) {
        updatedStages[currentStageIndex + 1].status = 'in-progress';
      }
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const handleStageBack = () => {
    if (currentStageIndex > 0) {
      setCurrentStageIndex(currentStageIndex - 1);
    }
  };

  const handleSkipStage = () => {
    if (currentStageIndex < writingStages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'in-progress':
        return <FaArrowRight className="text-blue-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-mint-300 rounded-full"></div>;
    }
  };

  const getStageStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-mint-100 text-mint-600 border-mint-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-mint-900 mb-4">Your Writing Journey</h1>
        <p className="text-xl text-mint-600">
          Follow this structured approach to complete your book from idea to publication
        </p>
      </div>

      {/* Stage Progress */}
      <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur mb-8">
        <h2 className="text-xl font-semibold mb-6 text-mint-900">Writing Journey Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {writingStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                index === currentStageIndex 
                  ? 'border-blue-300 bg-blue-50 shadow-md' 
                  : 'border-mint-200'
              }`}
            >
              {/* Stage Icon */}
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-mint-200">
                  {stage.icon}
                </div>
              </div>

              {/* Stage Info */}
              <div className="text-center">
                <h3 className="font-semibold text-mint-900 text-sm mb-1">{stage.name}</h3>
                <p className="text-xs text-mint-600 mb-3">{stage.description}</p>
                
                {/* Status */}
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStageStatusColor(stage.status)}`}>
                  {getStageStatusIcon(stage.status)}
                  <span className="capitalize">
                    {stage.status === 'not-started' ? 'Not Started' : stage.status}
                  </span>
                </div>
              </div>

              {/* Progress Line */}
              {index < writingStages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-mint-200 transform -translate-y-1/2 z-0">
                  <div className={`h-full transition-all duration-500 ${
                    stage.status === 'completed' ? 'bg-green-400' : 'bg-mint-200'
                  }`}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Current Stage Content */}
      <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center">
              {currentStage.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-mint-900">{currentStage.name}</h2>
              <p className="text-mint-600">{currentStage.description}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-mint-100 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStageIndex + 1) / writingStages.length) * 100}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-mint-500">
            Step {currentStageIndex + 1} of {writingStages.length}
          </p>
        </div>

        {/* Stage Component */}
        {currentStage.component && (
          <div className="min-h-[400px]">
            {currentStage.component === IdeaStage && (
              <IdeaStage
                onComplete={handleStageComplete}
                onBack={handleStageBack}
              />
            )}
            {/* Add other stage components here as they're created */}
          </div>
        )}

        {/* Stage Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-mint-200">
          <div className="flex gap-3">
            <Button
              onClick={onBack}
              variant="outline"
              className="border-mint-200 text-mint-700 hover:border-mint-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to Main
            </Button>
            
            {!isFirstStage && (
              <Button
                onClick={handleStageBack}
                variant="outline"
                className="border-mint-200 text-mint-700 hover:border-mint-300"
              >
                <FaArrowLeft className="mr-2" />
                Previous Stage
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            {!isLastStage && (
              <Button
                onClick={handleSkipStage}
                variant="outline"
                className="border-mint-200 text-mint-600 hover:border-mint-300"
              >
                Skip Stage
              </Button>
            )}
            
            {isLastStage && (
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-green-200 to-green-300 hover:from-green-300 hover:to-green-400 text-mint-900 border border-green-200"
              >
                Complete Journey
                <FaCheck className="ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 border-2 border-mint-100 bg-white/80 backdrop-blur mt-6">
        <h3 className="text-lg font-semibold mb-4 text-mint-900">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => {/* TODO: Open AI Assistant */}}
            className="bg-gradient-to-r from-pink-200 to-pink-300 hover:from-pink-300 hover:to-pink-400 text-mint-900 border border-pink-200"
          >
            <FaLightbulb className="mr-2" />
            Get AI Help
          </Button>
          
          <Button
            onClick={() => {/* TODO: Save Progress */}}
            variant="outline"
            className="border-mint-200 text-mint-700 hover:border-mint-300"
          >
            <FaCheck className="mr-2" />
            Save Progress
          </Button>
          
          <Button
            onClick={() => {/* TODO: Export Journey */}}
            variant="outline"
            className="border-mint-200 text-mint-700 hover:border-mint-300"
          >
            <FaRocket className="mr-2" />
            Export Journey
          </Button>
        </div>
      </Card>
    </div>
  );
}
