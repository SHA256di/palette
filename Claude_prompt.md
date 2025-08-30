# CLAUDE.md – Palette (Creative Workflow Curator)

## Philosophy

### Core Beliefs
- **MVP-first, then expand** — Build the moodboard layout first, then layer in extras (RAG, LoRA, analytics).  
- **User-first, not builder-first** — Palette is for creatives, strategists, and marketers who need *finished boards fast*, not for showing off ML pipelines.  
- **Pragmatic over fancy** — Integrate the simplest APIs that deliver value. Refine later with LoRA/brand-guideline RAG.  
- **Clear creative flow** — UX starts with input → outputs moodboard → then campaign mockups/briefs.  
- **Transparency in development** — Maintain clean commits, branches per feature, and docs that recruiters can follow.  

---

## Process

### 1. Planning & Staging (MVP-first)

Break into 4 major stages:

#### Stage 1: Core Playlist + Vibe Engine  
**Goal**: User enters vibe/keyword → curated playlist via Spotify + Last.fm tags.  
**Success Criteria**: Playlist is generated and embedded in moodboard.  
**Tests**: Verify Spotify/Last.fm pipeline returns accurate results.  
**Status**: Not Started  

#### Stage 2: Film + Album Recommender  
**Goal**: Add TMDb (films) and Discogs (album covers).  
**Success Criteria**: Vibe → mapped to curated film posters + album covers.  
**Tests**: Validate genre/tag normalization across APIs.  
**Status**: Not Started  

#### Stage 3: Moodboard Generator (Core MVP)  
**Goal**: Auto-curate a **collage-style board** (music + films + visuals + album covers + quotes/products).  
**Success Criteria**: Given inputs, system returns a rendered PNG/PDF moodboard with defined layout schema.  
**Tests**: Check all elements placed consistently; export works.  
**Status**: Not Started  

#### Stage 4: Hybrid Creative Workflow + Agent  
**Goal**: Add conversational assistant for iteration (“make it darker”, “lean Gen Z”).  
**Success Criteria**: User can either (a) fill a form OR (b) chat with AI → outputs moodboard + rationale.  
**Tests**: Compare chat vs form outputs; ensure consistency.  
**Status**: Not Started  

---

### 2. Implementation Flow
1. **Understand**: Review Spotify, Last.fm, TMDb, Discogs, Unsplash, Tumblr APIs.  
2. **Test**: Write mock tests for each integration (e.g., Discogs album fetch returns cover art).  
3. **Implement**: Start with Spotify + Last.fm → then TMDb + Discogs → then visuals.  
4. **Refactor**: Modularize into `music.ts`, `film.ts`, `visuals.ts`, `moodboard.ts`.  
5. **Branching**: Each feature in its own branch (`feature/spotify`, `feature/tmdb`, etc.). Merge via pull requests.  
6. **Commit**: Incremental commits with descriptive messages tied to PRD/sprint.  

---

## Technical Standards

### Stack

**Frontend**  
- Next.js (App Router) + Tailwind CSS  
- Konva.js or Fabric.js for moodboard rendering  

**Backend / Models**  
- Next.js API routes (serverless)  
- CLIP (open weights) for vibe embeddings  
- Sentence-Transformers for text similarity  
- Optional: LoRA adapters for consistent style transfer (stretch)  

**APIs**  
- Spotify API (music)  
- Last.fm API (genre tags, vibe mapping)  
- TMDb API (films)  
- Discogs API (album covers)  
- Unsplash API (general visuals)  
- Tumblr API (niche aesthetics, quotes)  

**Database / Storage**  
- Supabase (PostgreSQL for users, boards, embeddings)  
- Cloudinary (images + exported boards)  

**Agent Layer**  
- Claude / OpenAI / Llama-based LLM for chat + rationale generation  
- Unified orchestration = “creative director agent”  

---

### Error Handling
- Fail fast if API keys invalid (clear console + user message).  
- Graceful fallback: if one API fails, fill slot with alternative (e.g., no Tumblr → pull extra Unsplash image).  
- Deduplication filters for images/albums.  

---

### Decision Framework
When stuck:  
1. Prioritize **Moodboard MVP (Spotify + TMDb + Discogs + Unsplash)**.  
2. Push **RAG brand-guideline ingestion + LoRA adapters** to stretch goals.  
3. Always optimize for user-facing speed/value (boards in <2 min).  

---

## Quality Gates
- All API integrations have passing tests.  
- Moodboard layout consistently renders music + film + visuals + text.  
- Features merged only after validation in feature branches.  
- Documentation updated (`PRD.md`, `SPRINT_PLAN.md`).  
- Deployable on Vercel at `palette.querate.ai`.  

---

## Example Repo Commit & Branch Plan
- `feat: init repo, add README + CLAUDE.md` (main branch)  
- **Branch**: `feature/spotify-integration` → `feat: add Spotify + Last.fm music pipeline`  
- **Branch**: `feature/tmdb-discogs` → `feat: add TMDb + Discogs film/album modules`  
- **Branch**: `feature/moodboard-layout` → `feat: implement collage layout w/ Konva.js`  
- **Branch**: `feature/unsplash-tumblr` → `feat: integrate Unsplash + Tumblr visuals`  
- **Branch**: `feature/export` → `feat: add PDF/PNG export + shareable link`  
- **Branch**: `feature/agent-integration` → `feat: add Claude conversational workflow`  
- `chore: add eval logs + update documentation`  
