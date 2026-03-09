# Component Map

Which components are used where and how they relate.

---

## Main App Flow

The primary entry point is **`src/app/page.tsx`** → **`BookWriterApp`** (`src/components/BookWriter/BookWriterApp.tsx`).

### BookWriterApp Dependencies

| Component | Path | Role |
|-----------|------|------|
| ThemeSwitcher | `Theme/ThemeSwitcher` | Theme toggle |
| SimpleBookWriter | `BookWriter/SimpleBookWriter` | Main writing view |
| AIBookGenerator | `BookWriter/AIBookGenerator` | AI book/chapter generation |
| WritingAssistant | `AI/WritingAssistant` | Floating AI assistant panel |
| ToolsReference | `BookWriter/ToolsReference` | Tools reference panel |
| StoryOutlinePanel | `BookWriter/StoryOutlinePanel` | Outline view |
| ChapterManager | `BookWriter/ChapterManager` | Chapter list, reorder, delete |
| WritingStats | `BookWriter/WritingStats` | Writing statistics modal |

### SimpleBookWriter Dependencies

| Component | Path | Role |
|-----------|------|------|
| FullRichTextEditor | `BookWriter/FullRichTextEditor` | Rich text editor for chapters |

---

## Alternative Layouts (not currently on main route)

| Layout | Path | Used by | Notes |
|--------|------|---------|-------|
| CleanWriterLayout | `Layout/CleanWriterLayout` | None (orphaned) | Uses StructureSidebar, EnhancedPaperEditor, WelcomeScreen |
| ScrivenerLayout | `Layout/ScrivenerLayout` | None (orphaned) | Wrapper layout |
| StructureSidebar | `Layout/StructureSidebar` | CleanWriterLayout | Sidebar with many AI/writing components |
| EnhancedPaperEditor | `Layout/EnhancedPaperEditor` | CleanWriterLayout | Paper-style editor |
| PaperEditor | `Layout/PaperEditor` | Unused | Alternate paper editor |
| WelcomeScreen | `Layout/WelcomeScreen` | CleanWriterLayout | Welcome/onboarding screen |

---

## AI Components – Overlap / Similarity

| Component | Used by | Purpose |
|-----------|---------|---------|
| **WritingAssistant** | BookWriterApp | Floating panel, contextual suggestions – main app |
| **LiveWritingAssistant** | StructureSidebar, analytics | Real-time writing help |
| **WritingCompanion** | StructureSidebar | Chat-style companion |
| **AdvancedWritingAssistant** | EnhancedPaperEditor | Advanced AI features |
| **FloatingAIAssistant** | EnhancedPaperEditor | Floating AI panel |
| **RealTimeWritingCompanion** | Unused? | Real-time companion |
| **AILibrarian** | `/ai-librarian` page | Librarian chat interface |

**Consolidation idea**: Multiple overlapping AI assistants. BookWriterApp uses WritingAssistant; StructureSidebar/CleanWriterLayout use a different set. Consider unifying under one AI layer with configurable modes.

---

## Chapter Components – Overlap

| Component | Used by | Purpose |
|-----------|---------|---------|
| **BookWriter/ChapterManager** | BookWriterApp | Chapter list, reorder, delete (local state) |
| **Chapter/ChapterManager** | StructureSidebar | Chapter list with useBookStore, AI generate |
| **Chapters/ChapterList** | StructureSidebar | Chapter list view |
| **Chapter/ChapterList** | Unused? | Alternate chapter list |
| **Chapter/ChapterItem** | Chapter/ChapterManager | Chapter row item |
| **Chapter/ChapterGenerator** | StructureSidebar | AI chapter generation |

**Note**: BookWriterApp uses local state; StructureSidebar/Chapter use Zustand (useBookStore).

---

## Story Generator Components – Overlap

| Component | Used by | Purpose |
|-----------|---------|---------|
| **AIBookGenerator** | BookWriterApp | AI book/chapter generation – main app |
| **SessionBasedStoryGenerator** | StructureSidebar | Session-based story generation |
| **AutoStoryGenerator** | Unused? | Auto story generation |
| **StoryGenerator** | Unused? | Story generation |

---

## Character Components

| Component | Used by | Purpose |
|-----------|---------|---------|
| CharacterEditor | StructureSidebar | Character editing |
| CharacterForm | Unused? | Character form |
| CharacterList | Unused? | Character list |
| CharacterVisualizer | StructureSidebar, analytics | Character graph/visualization |
| CharacterGraph | Unused? | Character graph |
| Characters/CharacterList | Unused? | Alternate character list |

---

## Other Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | BookWriterApp | Main writing app |
| `/analytics` | Analytics page | Writing analytics, gamification |
| `/ai-librarian` | AILibrarian | AI librarian chat |
| `/references` | WritingReference | Writing reference |

---

## Consolidation Opportunities

1. **AI assistants**: Merge WritingAssistant, LiveWritingAssistant, WritingCompanion into one configurable AI layer  
2. **Chapter management**: One ChapterManager with optional store/local-state modes  
3. **Story generators**: One primary story generator with different modes (full book vs session vs outline)  
4. **Unused layouts**: CleanWriterLayout, ScrivenerLayout – either integrate into main flow or archive  

---

_Last updated: February 2026_
