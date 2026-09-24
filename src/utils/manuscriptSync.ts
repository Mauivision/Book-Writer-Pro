import { useBookStore } from '@/store/useBookStore';
import {
  hasUserContent,
  loadManuscript,
  manuscriptToBookStoreSnapshot,
} from '@/utils/manuscriptStorage';
import type { ManuscriptState } from '@/types/manuscript';

export function syncManuscriptToBookStore(state: ManuscriptState): boolean {
  if (!hasUserContent(state)) return false;
  useBookStore.getState().loadBook(manuscriptToBookStoreSnapshot(state));
  return true;
}

export function hydrateBookStoreFromManuscript(): boolean {
  const loaded = loadManuscript();
  if (!loaded.recovered) return false;
  return syncManuscriptToBookStore(loaded.state);
}
