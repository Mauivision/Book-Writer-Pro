import { useBookStore } from '@/store/useBookStore';

export default function CharacterList() {
  const { characters } = useBookStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Characters</h2>
        <button
          onClick={() => {
            // TODO: Implement add character functionality
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add Character
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <div
            key={character.id}
            className="p-4 bg-white rounded-lg shadow"
          >
            <h3 className="font-medium">{character.name}</h3>
            <p className="text-sm text-gray-500">{character.role}</p>
            <p className="mt-2 text-sm">{character.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 