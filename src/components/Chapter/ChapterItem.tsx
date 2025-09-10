import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Chapter } from '@/types'

interface ChapterItemProps {
  chapter: Chapter
  onEdit: (chapter: Chapter) => void
  onUpdate: (chapter: Chapter) => void
  onDelete: () => void
  isEditing: boolean
}

export function ChapterItem({ chapter, onEdit, onUpdate, onDelete, isEditing }: ChapterItemProps) {
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
      {...attributes}
      {...listeners}
      className="flex items-center justify-between p-4 bg-white rounded-lg shadow cursor-move"
    >
      {isEditing ? (
        <input
          type="text"
          defaultValue={chapter.title}
          onBlur={(e) => onUpdate({ ...chapter, title: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onUpdate({ ...chapter, title: e.currentTarget.value })
            }
          }}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">#{chapter.id}</span>
          <span className="text-left hover:text-blue-600">
            {chapter.title}
          </span>
          <span className="text-sm text-gray-500">
            {chapter.status}
          </span>
        </div>
      )}
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(chapter)}
          className="text-gray-500 hover:text-gray-700"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
} 