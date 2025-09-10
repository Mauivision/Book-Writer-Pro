import { useBookStore } from '@/store/useBookStore';

export default function MetadataPanel() {
  const { metadata, updateMetadata } = useBookStore();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Book Metadata</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={metadata.title}
            onChange={(e) => updateMetadata({ title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            value={metadata.genre}
            onChange={(e) => updateMetadata({ genre: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <input
            type="text"
            id="theme"
            value={metadata.theme}
            onChange={(e) => updateMetadata({ theme: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700">
            Synopsis
          </label>
          <textarea
            id="synopsis"
            rows={4}
            value={metadata.synopsis}
            onChange={(e) => updateMetadata({ synopsis: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
} 