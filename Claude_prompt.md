# CLAUDE.md – Palette (Creative Workflow Curator)

## Philosophy

### Core Beliefs
- **Incremental progress** — Ship small, validated features quickly (Spotify → Films → Moodboard → Exports).  
- **User-first, not builder-first** — Palette exists to save creatives time and output usable inspo packs, not to show off complexity.  
- **Pragmatic over fancy** — Prefer simple integrations and APIs that prove value. Add LoRA/image generation later.  
- **Clear creative flow** — Inputs should feel intuitive (vibe, purpose, audience, platform), and outputs should directly inspire campaigns/posts.  
- **Transparency in development** — Keep tight commits, branches, and docs so features are easy to trace.  

## Process

### 1. Planning & Staging

#### Stage 1: Core Playlist Engine
**Goal**: User enters a vibe → system maps it to genres/tags → curated Spotify playlist.  
**Success Criteria**: Playlist embed is generated; embeddings/keywords align with vibe.  
**Tests**: Verify API calls return valid tracks; check tag matching with CLIP or sentence-transformers.  
**Status**: Not Started  

#### Stage 2: Film + Visual Recommender
**Goal**: Add TMDb (films) and Unsplash/Tumblr (images).  
**Success Criteria**: User enters vibe → output includes film stills/posters + moodboard images.  
**Tests**: Verify API queries with tags, check variety and cultural fit.  
**Status**: Not Started  

#### Stage 3: Cross-Modal Board Generator
**Goal**: Generate a cohesive inspo pack (playlist + films + visuals).  
**Success Criteria**: All outputs returned on one board page.  
**Tests**: Confirm sections load, verify “aesthetic fit” with similarity scoring.  
**Status**: Not Started  

#### Stage 4: Workflow Personalization
**Goal**: Add inputs for **purpose (personal/campaign)**, **audience (Gen Z/Millennials/both)**, **platform (LinkedIn/Instagram/Facebook/TikTok)**, and **output type (mock-up/shoot ideas/set design)**.  
**Success Criteria**: Outputs adapt based on user input (hashtags, post ideas, rationale differ by audience/platform).  
**Tests**: Compare Gen Z vs Millennial outputs, validate differentiation.  
**Status**: Not Started  

#### Stage 5: Export Layer
**Goal**: Provide export as **shareable link** and **PDF/slidedeck**.  
**Success Criteria**: User can copy link to board or download PDF deck.  
**Tests**: Ensure links resolve dynamically; PDF export matches design.  
**Status**: Not Started  

#### Stage 6: Agent Workflow (Chat Mode)
**Goal**: Wrap workflows in a conversational agent (Claude/GPT).  
**Success Criteria**: User can either fill a form OR chat with AI → consistent outputs.  
**Tests**: Compare chat vs structured outputs for consistency.  
**Status**: Not Started  

### 2. Implementation Flow
1. **Understand**: Review Spotify, TMDb, Unsplash APIs. Validate limits.  
2. **Test**: Mock API calls (e.g., Spotify search for “indie sleaze”).  
3. **Implement**:  
   - Start with Spotify → TMDb → Unsplash.  
   - Add vibe-to-tag mapping with CLIP/sentence-transformers.  
4. **Refactor**: Modularize integrations into `music.ts`, `film.ts`, `visuals.ts`, `hashtags.ts`.  
5. **Branching**: Each feature gets its own branch. Merge via PR after validation.  
6. **Commit**: Incremental, descriptive commit messages tied to feature.  

## Technical Standards

### Stack
**Frontend**  
- Next.js (App Router) + Tailwind CSS  

**Backend / Models**  
- Next.js API routes (serverless)  
- CLIP (open weights) for vibe embeddings  
- Sentence-Transformers for text → tag mapping  
- LLM (Claude / GPT-4 / LLaMA-3) for rationale, hashtags, post ideas  

**APIs**  
- Spotify API (music)  
- TMDb API (films/media)  
- Unsplash API (moodboard photos)  
- Tumblr API (aesthetic imagery)  

**Database / Storage**  
- Supabase (PostgreSQL for users, boards, metadata)  
- Cloudinary (for storing images/exports)  

**Export Layer**  
- Dynamic routes in Next.js for shareable links (`/board/[id]`)  
- Puppeteer (HTML → PDF) for slide/PDF export  

**Agent Layer**  
- Claude/OpenAI/LLaMA for conversational orchestration (“creative director agent”)  

### Error Handling
- Fail fast on invalid API keys.  
- Provide fallback recommendations if APIs return no results.  
- Graceful degrade: if one source fails (Spotify), still return films + visuals.  

### Decision Framework
When in doubt:  
1. Deliver **one usable board end-to-end** before adding new features.  
2. Prioritize **shareable impact** (export link/PDF) over advanced ML.  
3. Keep code modular to plug in LoRA/gen images later.  

## Quality Gates
- All API integrations tested individually.  
- Clear commit messages per feature.  
- Boards render correctly across desktop + mobile.  
- Export (link + PDF) works before stretch features.  
- Documentation updated (`PRD.md`, `CLAUDE.md`, `SPRINT_PLAN.md`).  
- Deployed demo live on Vercel.  

## Example Repo Commit & Branch Plan
- `feat: init repo, add README + CLAUDE.md` (main)  
- **Branch**: `feature/spotify-integration` → `feat: add Spotify playlist generation`  
- **Branch**: `feature/tmdb-films` → `feat: add TMDb film recommendations`  
- **Branch**: `feature/unsplash-visuals` → `feat: add Unsplash images to boards`  
- **Branch**: `feature/vibe-mapping` → `feat: integrate CLIP for vibe-to-tag matching`  
- **Branch**: `feature/board-generator` → `feat: render full inspo pack page`  
- **Branch**: `feature/export` → `feat: implement export (PDF + shareable link)`  
- **Branch**: `feature/workflow-inputs` → `feat: add purpose/audience/platform input options`  
- **Branch**: `feature/agent-integration` → `feat: integrate Claude chat workflow`  
- `chore: add eval logs + update docs`  

