# Component Map

The live app is the Next.js project at the repo root.

## Routes

| Route | Entry | Role |
| --- | --- | --- |
| `/` | `src/app/page.tsx` → `BookWriterApp` | Main writer |
| `/login` | `src/app/login/page.tsx` | `APP_PASSWORD` gate |
| `/settings` | `src/app/settings/page.tsx` | Provider test and sign-out |
| `/analytics` | `src/app/analytics/page.tsx` | Stats and writing tools |
| `/references` | `src/app/references/page.tsx` | Writing references |
| `/ai-librarian` | `src/app/ai-librarian/page.tsx` | Librarian chat |

## Main writer (`BookWriterApp`)

| Piece | Path |
| --- | --- |
| Writer | `BookWriter/SimpleBookWriter` + `FullRichTextEditor` |
| Outline | `BookWriter/StoryOutlinePanel` |
| Chapters | `BookWriter/ChapterManager` |
| AI book generator | `BookWriter/AIBookGenerator` |
| Team review | `AI/EditorialTeamPanel` |
| AI settings | `AI/AISettings` |
| Provider badge | `AI/ProviderStatusBadge` |
| Persistence | `utils/manuscriptStorage.ts` (`book-writer-manuscript-v1`) |

## AI path

Every generator (book, rewrite, outline, continuity, team review, librarian, API routes) goes through:

1. Browser: `generateCompletion` / `aiWriting` / `apiClient`
2. Route: `/api/ai/*`
3. Server: `utils/aiGateway.ts`

Ollama is the default. xAI Grok is the hosted backup. Keys stay on the server.

## Manuscript save

Home-page chapters are saved to `localStorage` as soon as they change. Analytics and the librarian hydrate from that same manuscript when it contains user work.
