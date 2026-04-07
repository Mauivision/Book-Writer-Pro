'use client';

import { useEffect, useState } from 'react';
import { useBookStore } from '@/store/useBookStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaUser,
  FaMap,
  FaClock,
  FaMagic,
  FaBrain,
  FaLightbulb,
  FaChartLine,
  FaCog,
  FaDownload,
  FaEye,
  FaComments,
  FaRocket,
  FaStar,
  FaFire,
  FaTrophy,
  FaPalette,
  FaRoute,
  FaUsers,
  FaBookmark,
  FaRegCompass,
  FaExclamationTriangle,
  FaAward,
  FaCheckCircle,
  FaGem,
  FaTimes,
} from 'react-icons/fa';
import WritingCompanion from '@/components/AI/WritingCompanion';
import ChapterGenerator from '@/components/Chapter/ChapterGenerator';
import CharacterEditor from '@/components/Character/CharacterEditor';
import EnhancedExportDialog from '@/components/Export/EnhancedExportDialog';
import WritingAnalytics from '@/components/AI/WritingAnalytics';
import WritingGoals from '@/components/AI/WritingGoals';
import WritingStreak from '@/components/AI/WritingStreak';
import DailyChallenges from '@/components/AI/DailyChallenges';
import StoryConsistencyBot from '@/components/AI/StoryConsistencyBot';
import PlotHoleDetector from '@/components/AI/PlotHoleDetector';
import LiveWritingAssistant from '@/components/AI/LiveWritingAssistant';
import AdvancedWritingTools from '@/components/AI/AdvancedWritingTools';
import CharacterMemorySystem from '@/components/AI/CharacterMemorySystem';
import ChapterCompletionTracker from '@/components/AI/ChapterCompletionTracker';
import AchievementNotification from '@/components/AI/AchievementNotification';
import SessionBasedStoryGenerator from '@/components/AI/SessionBasedStoryGenerator';
import { IntelligentTextAnalyzer } from '@/components/AI/Analysis/IntelligentTextAnalyzer';
import { WritingInsightsDashboard } from '@/components/AI/Analysis/WritingInsightsDashboard';
import { AIMemorySystem } from '@/components/AI/Memory/AIMemorySystem';
import { VoiceToneAnalyzer } from '@/components/AI/Analysis/VoiceToneAnalyzer';
import { SmartWritingPrompts } from '@/components/AI/Prompts/SmartWritingPrompts';
import ChapterManager from '@/components/Chapter/ChapterManager';

interface SectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-gray-900 dark:text-white">
            {title}
          </span>
        </div>
        {isOpen ? (
          <FaChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <FaChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && <div className="ml-8 mt-2 space-y-2">{children}</div>}
    </div>
  );
}

export function StructureSidebar() {
  const {
    chapters,
    characters,
    plot,
    setting,
    metadata,
    currentChapter,
    setCurrentChapter,
    addChapter,
    updateChapter,
    deleteChapter,
    reorderChapters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  } = useBookStore();

  const [showChapterGenerator, setShowChapterGenerator] = useState(false);
  const [showCharacterEditor, setShowCharacterEditor] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showWritingCompanion, setShowWritingCompanion] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showStreak, setShowStreak] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showConsistencyBot, setShowConsistencyBot] = useState(false);
  const [showPlotHoleDetector, setShowPlotHoleDetector] = useState(false);
  const [showLiveAssistant, setShowLiveAssistant] = useState(false);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showCharacterMemory, setShowCharacterMemory] = useState(false);
  const [showCompletionTracker, setShowCompletionTracker] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStoryGenerator, setShowStoryGenerator] = useState(false);
  const [showTextAnalyzer, setShowTextAnalyzer] = useState(false);
  const [showInsightsDashboard, setShowInsightsDashboard] = useState(false);
  const [showAIMemory, setShowAIMemory] = useState(false);
  const [showVoiceAnalyzer, setShowVoiceAnalyzer] = useState(false);
  const [showSmartPrompts, setShowSmartPrompts] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [pendingSelectNewestChapter, setPendingSelectNewestChapter] =
    useState(false);

  const handleAddChapter = () => {
    const newChapter = {
      title: `Chapter ${chapters.length + 1}`,
      content: '',
      summary: '',
      order: chapters.length,
      wordCount: 0,
      status: 'draft' as const,
    };
    addChapter(newChapter);
    setPendingSelectNewestChapter(true);
  };

  useEffect(() => {
    if (!pendingSelectNewestChapter) return;
    if (chapters.length === 0) return;
    setCurrentChapter(chapters[chapters.length - 1].id);
    setPendingSelectNewestChapter(false);
  }, [chapters, pendingSelectNewestChapter, setCurrentChapter]);

  const OverlayModal = ({
    title,
    onClose,
    children,
  }: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Writing Structure
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Organize your story elements and access all writing tools
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Book Structure */}
        <Section title="Book Structure" icon={FaBook} defaultOpen={true}>
          <div className="space-y-2">
            <Button
              onClick={handleAddChapter}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Chapter
            </Button>

            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  currentChapter === chapter.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
                onClick={() => setCurrentChapter(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {chapter.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {chapter.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        // Edit chapter title
                      }}
                    >
                      <FaEdit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        deleteChapter(chapter.id);
                      }}
                    >
                      <FaTrash className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Characters */}
        <Section title="Characters" icon={FaUser}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowCharacterEditor(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Character
            </Button>

            {characters.map(character => (
              <div
                key={character.id}
                className="p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {character.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {character.role}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Plot & Setting */}
        <Section title="Plot & Setting" icon={FaMap}>
          <div className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaMap className="w-4 h-4 mr-2" />
              Plot Points
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaClock className="w-4 h-4 mr-2" />
              Timeline
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaRoute className="w-4 h-4 mr-2" />
              Story Arc
            </Button>
          </div>
        </Section>

        {/* AI Writing Tools */}
        <Section title="AI Writing Tools" icon={FaMagic}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowWritingCompanion(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaComments className="w-4 h-4 mr-2" />
              Writing Companion
            </Button>
            <Button
              onClick={() => setShowChapterGenerator(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaRocket className="w-4 h-4 mr-2" />
              Generate Chapter
            </Button>
            <Button
              onClick={() => setShowChapterList(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaBook className="w-4 h-4 mr-2" />
              Chapter Manager
            </Button>
            <Button
              onClick={() => setShowLiveAssistant(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaBrain className="w-4 h-4 mr-2" />
              Live Assistant
            </Button>
            <Button
              onClick={() => setShowAdvancedTools(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaLightbulb className="w-4 h-4 mr-2" />
              Advanced Tools
            </Button>
            <Button
              onClick={() => setShowStoryGenerator(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaRegCompass className="w-4 h-4 mr-2" />
              Story Generator
            </Button>
            <Button
              onClick={() => setShowSmartPrompts(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaLightbulb className="w-4 h-4 mr-2" />
              Smart Prompts
            </Button>
          </div>
        </Section>

        {/* Quality & Consistency */}
        <Section title="Quality & Consistency" icon={FaStar}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowConsistencyBot(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaStar className="w-4 h-4 mr-2" />
              Consistency Bot
            </Button>
            <Button
              onClick={() => setShowPlotHoleDetector(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaExclamationTriangle className="w-4 h-4 mr-2" />
              Plot Hole Detector
            </Button>
            <Button
              onClick={() => setShowCharacterMemory(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaUsers className="w-4 h-4 mr-2" />
              Character Memory
            </Button>
          </div>
        </Section>

        {/* Progress & Goals */}
        <Section title="Progress & Goals" icon={FaChartLine}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowGoals(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaTrophy className="w-4 h-4 mr-2" />
              Writing Goals
            </Button>
            <Button
              onClick={() => setShowStreak(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaFire className="w-4 h-4 mr-2" />
              Writing Streak
            </Button>
            <Button
              onClick={() => setShowChallenges(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaAward className="w-4 h-4 mr-2" />
              Daily Challenges
            </Button>
            <Button
              onClick={() => setShowCompletionTracker(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaCheckCircle className="w-4 h-4 mr-2" />
              Chapter Tracker
            </Button>
            <Button
              onClick={() => setShowAchievements(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaGem className="w-4 h-4 mr-2" />
              Achievements
            </Button>
          </div>
        </Section>

        {/* Analytics & Insights */}
        <Section title="Analytics & Insights" icon={FaChartLine}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowAnalytics(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaChartLine className="w-4 h-4 mr-2" />
              Writing Analytics
            </Button>
            <Button
              onClick={() => setShowTextAnalyzer(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaBrain className="w-4 h-4 mr-2" />
              Text Analyzer
            </Button>
            <Button
              onClick={() => setShowInsightsDashboard(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaChartLine className="w-4 h-4 mr-2" />
              Insights Dashboard
            </Button>
            <Button
              onClick={() => setShowVoiceAnalyzer(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaPalette className="w-4 h-4 mr-2" />
              Voice Analyzer
            </Button>
          </div>
        </Section>

        {/* Export & Publishing */}
        <Section title="Export & Publishing" icon={FaDownload}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowExportDialog(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Export Book
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaEye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </Section>

        {/* AI Memory System */}
        <Section title="AI Memory System" icon={FaBrain}>
          <div className="space-y-2">
            <Button
              onClick={() => setShowAIMemory(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaBrain className="w-4 h-4 mr-2" />
              Story Memory
            </Button>
            <Button
              onClick={() => setShowCharacterMemory(true)}
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaUsers className="w-4 h-4 mr-2" />
              Character Memory
            </Button>
          </div>
        </Section>

        {/* References */}
        <Section title="References" icon={FaBookmark}>
          <div className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaBookmark className="w-4 h-4 mr-2" />
              Writing Prompts
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              size="sm"
            >
              <FaPalette className="w-4 h-4 mr-2" />
              Style Guide
            </Button>
          </div>
        </Section>
      </div>

      {/* Modals */}
      {showChapterGenerator && (
        <ChapterGenerator
          onChapterGenerated={chapterId => {
            setCurrentChapter(chapterId);
            setShowChapterGenerator(false);
          }}
          onClose={() => setShowChapterGenerator(false)}
        />
      )}

      {showCharacterEditor && (
        <CharacterEditor
          onClose={() => setShowCharacterEditor(false)}
          onSave={() => {}}
        />
      )}

      {showExportDialog && (
        <OverlayModal title="Export" onClose={() => setShowExportDialog(false)}>
          <EnhancedExportDialog />
        </OverlayModal>
      )}

      {showWritingCompanion && (
        <OverlayModal
          title="Writing Companion"
          onClose={() => setShowWritingCompanion(false)}
        >
          <WritingCompanion />
        </OverlayModal>
      )}

      {showAnalytics && (
        <OverlayModal
          title="Writing Analytics"
          onClose={() => setShowAnalytics(false)}
        >
          <WritingAnalytics />
        </OverlayModal>
      )}

      {showGoals && (
        <OverlayModal title="Goals" onClose={() => setShowGoals(false)}>
          <WritingGoals />
        </OverlayModal>
      )}

      {showStreak && (
        <OverlayModal title="Streak" onClose={() => setShowStreak(false)}>
          <WritingStreak />
        </OverlayModal>
      )}

      {showChallenges && (
        <OverlayModal
          title="Daily Challenges"
          onClose={() => setShowChallenges(false)}
        >
          <DailyChallenges />
        </OverlayModal>
      )}

      {showConsistencyBot && (
        <OverlayModal
          title="Story Consistency"
          onClose={() => setShowConsistencyBot(false)}
        >
          <StoryConsistencyBot />
        </OverlayModal>
      )}

      {showPlotHoleDetector && (
        <OverlayModal
          title="Plot Hole Detector"
          onClose={() => setShowPlotHoleDetector(false)}
        >
          <PlotHoleDetector />
        </OverlayModal>
      )}

      {showLiveAssistant && (
        <OverlayModal
          title="Live Writing Assistant"
          onClose={() => setShowLiveAssistant(false)}
        >
          <LiveWritingAssistant />
        </OverlayModal>
      )}

      {showAdvancedTools && (
        <OverlayModal
          title="Advanced Writing Tools"
          onClose={() => setShowAdvancedTools(false)}
        >
          <AdvancedWritingTools />
        </OverlayModal>
      )}

      {showCharacterMemory && (
        <OverlayModal
          title="Character Memory"
          onClose={() => setShowCharacterMemory(false)}
        >
          <CharacterMemorySystem />
        </OverlayModal>
      )}

      {showCompletionTracker && (
        <OverlayModal
          title="Chapter Completion"
          onClose={() => setShowCompletionTracker(false)}
        >
          <ChapterCompletionTracker />
        </OverlayModal>
      )}

      {showAchievements && (
        <AchievementNotification
          achievement={null}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showStoryGenerator && (
        <OverlayModal
          title="Session-Based Story Generator"
          onClose={() => setShowStoryGenerator(false)}
        >
          <SessionBasedStoryGenerator />
        </OverlayModal>
      )}

      {showTextAnalyzer && (
        <IntelligentTextAnalyzer
          text={chapters.find(ch => ch.id === currentChapter)?.content || ''}
          onInsightSelect={insight => console.log('Insight selected:', insight)}
        />
      )}

      {showInsightsDashboard && (
        <WritingInsightsDashboard
          text={chapters.find(ch => ch.id === currentChapter)?.content || ''}
          onInsightSelect={insight => console.log('Insight selected:', insight)}
        />
      )}

      {showAIMemory && (
        <AIMemorySystem
          text={chapters.find(ch => ch.id === currentChapter)?.content || ''}
          onMemorySelect={memory => console.log('Memory selected:', memory)}
          onMemoryCreate={memory => console.log('Memory created:', memory)}
        />
      )}

      {showVoiceAnalyzer && (
        <VoiceToneAnalyzer
          text={chapters.find(ch => ch.id === currentChapter)?.content || ''}
          onVoiceInsight={insight => console.log('Voice insight:', insight)}
        />
      )}

      {showSmartPrompts && (
        <SmartWritingPrompts
          currentText={
            chapters.find(ch => ch.id === currentChapter)?.content || ''
          }
          writingContext={{
            genre: metadata.genre,
            mood: 'mysterious',
            characters: characters.map(c => c.name),
            setting: setting.location,
            theme: plot.themes?.[0] ?? '',
          }}
          onPromptSelect={prompt => console.log('Prompt selected:', prompt)}
        />
      )}

      {showChapterList && (
        <OverlayModal
          title="Chapter Manager"
          onClose={() => setShowChapterList(false)}
        >
          <ChapterManager
            chapters={chapters}
            onChaptersUpdate={next => reorderChapters(next)}
            onChapterSelect={chapterId => {
              setCurrentChapter(chapterId);
              setShowChapterList(false);
            }}
          />
        </OverlayModal>
      )}
    </div>
  );
}
