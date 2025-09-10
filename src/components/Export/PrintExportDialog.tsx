import { useState } from 'react'
import { exportToPrintReadyPDF } from '@/utils/export'

interface PrintExportDialogProps {
  isOpen: boolean
  onClose: () => void
  chapters: any[]
  metadata: {
    title: string
    author: string
  }
}

export default function PrintExportDialog({
  isOpen,
  onClose,
  chapters,
  metadata
}: PrintExportDialogProps) {
  const [bookSize, setBookSize] = useState<'TRADE_PAPERBACK' | 'MASS_MARKET' | 'HARDCOVER'>('TRADE_PAPERBACK')
  const [includeCover, setIncludeCover] = useState(true)
  const [includeCopyright, setIncludeCopyright] = useState(true)
  const [includeTOC, setIncludeTOC] = useState(true)
  const [isbn, setIsbn] = useState('')
  const [publisher, setPublisher] = useState('')
  const [copyrightYear, setCopyrightYear] = useState(new Date().getFullYear())

  if (!isOpen) return null

  const handleExport = async () => {
    await exportToPrintReadyPDF(chapters, {
      ...metadata,
      isbn,
      publisher,
      copyrightYear
    }, {
      bookSize,
      includeCover,
      includeCopyright,
      includeTableOfContents: includeTOC
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Print Export Options</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Book Size</label>
            <select
              value={bookSize}
              onChange={(e) => setBookSize(e.target.value as any)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="TRADE_PAPERBACK">Trade Paperback (6" x 9")</option>
              <option value="MASS_MARKET">Mass Market (4.125" x 6.75")</option>
              <option value="HARDCOVER">Hardcover (6" x 9")</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCover}
                onChange={(e) => setIncludeCover(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Include Cover Page</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeCopyright}
                onChange={(e) => setIncludeCopyright(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Include Copyright Page</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={includeTOC}
                onChange={(e) => setIncludeTOC(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Include Table of Contents</span>
            </label>
          </div>

          {includeCopyright && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ISBN</label>
                <input
                  type="text"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Publisher</label>
                <input
                  type="text"
                  value={publisher}
                  onChange={(e) => setPublisher(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Copyright Year</label>
                <input
                  type="number"
                  value={copyrightYear}
                  onChange={(e) => setCopyrightYear(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  )
} 