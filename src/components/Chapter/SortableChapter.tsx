import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Chapter {
  id: string
  title: string
  content: string
  wordCount: number
  parentId?: string
}

interface SortableChapterProps {
  chapter: Chapter
}

export function SortableChapter({ chapter }: SortableChapterProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="chapter-item bg-white p-4 mb-2 rounded-lg shadow hover:shadow-md transition-shadow"
      {...attributes}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="drag-handle cursor-move p-2 hover:bg-gray-100 rounded"
            {...listeners}
          >
            ≡
          </button>
          <h3 className="text-lg font-medium">{chapter.title}</h3>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {chapter.wordCount} words
          </span>
          <button className="text-blue-500 hover:text-blue-700">
            Edit
          </button>
        </div>
      </div>
    </div>
  )
} 