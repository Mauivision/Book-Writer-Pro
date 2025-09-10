import { useState } from 'react'
import { useBookStore } from '@/store/useBookStore'
import { Chapter } from '@/types'
import { generateChapterTitle } from '@/utils/nameGenerator'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { ChapterItem } from '@/components/Chapter/ChapterItem'
import { toast } from 'react-hot-toast'

interface ChapterManagerProps {
  chapters: Chapter[]
  onChaptersUpdate: (chapters: Chapter[]) => void
  onChapterSelect: (id: string) => void
}

export default function ChapterManager({ chapters, onChaptersUpdate, onChapterSelect }: ChapterManagerProps) {
  const { addChapter, updateChapter, removeChapter, reorderChapters, generateChapter, characters, plot, setting, metadata } = useBookStore()
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handlers
  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return

    addChapter({
      title: newChapterTitle,
      content: '',
      summary: '',
      wordCount: 0,
      order: chapters.length,
      status: 'draft'
    })
    setNewChapterTitle('')
  }

  const handleGenerateChapter = async () => {
    try {
      setIsGenerating(true)
      const generatedTitle = generateChapterTitle()
      
      // Build context from existing story elements
      const context = {
        plot: plot.summary,
        characters: characters.map(c => `${c.name} (${c.role}): ${c.description}`).join(', '),
        setting: setting.description,
        genre: metadata.genres[0] || 'Fantasy',
        theme: metadata.description || 'Adventure',
        previousChapters: chapters.slice(-3).map(c => c.title) // Last 3 chapters for context
      };

      const newChapter = await generateChapter({
        title: generatedTitle,
        prompt: `Generate a chapter that continues the story naturally, advancing the plot and developing characters.`,
        style: 'professional',
        tone: 'engaging',
        pov: 'third',
        length: 1000,
        context
      });

      toast.success('Chapter generated successfully!');
      
    } catch (error) {
      console.error('Error generating chapter:', error)
      toast.error('Failed to generate chapter. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUpdateChapter = (chapter: Chapter) => {
    updateChapter(chapter.id, chapter)
    setEditingChapter(null)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = chapters.findIndex((chapter) => chapter.id === active.id)
      const newIndex = chapters.findIndex((chapter) => chapter.id === over.id)
      
      // Create new array with reordered chapters
      const reorderedChapters = [...chapters]
      const [movedChapter] = reorderedChapters.splice(oldIndex, 1)
      reorderedChapters.splice(newIndex, 0, movedChapter)
      
      reorderChapters(reorderedChapters)
    }
  }

  // Render
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          placeholder="New chapter title"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={handleAddChapter}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Add Chapter
        </button>
        <button
          onClick={handleGenerateChapter}
          disabled={isGenerating}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={chapters.map(chapter => chapter.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter.id}
                chapter={chapter}
                onEdit={() => setEditingChapter(chapter)}
                onUpdate={handleUpdateChapter}
                onDelete={() => removeChapter(chapter.id)}
                isEditing={editingChapter?.id === chapter.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
} 