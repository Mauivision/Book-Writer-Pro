'use client';

import { useEffect } from 'react';
import { AILibrarian } from '@/components/AI/AILibrarian';
import { hydrateBookStoreFromManuscript } from '@/utils/manuscriptSync';

export default function AILibrarianPage() {
  useEffect(() => {
    hydrateBookStoreFromManuscript();
  }, []);

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="h-full">
        <AILibrarian />
      </div>
    </div>
  );
} 