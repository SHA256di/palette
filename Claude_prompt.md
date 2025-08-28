# CLAUDE.md – palette (Creative Workflow Curator)

## Philosophy

### Core Beliefs
- **Incremental progress** — Build and ship features in small, validated steps.  
- **User-first, not builder-first** — Palette is for creatives (directors, content creators, strategists) who need inspiration quickly, not for showing off technical complexity.  
- **Pragmatic over fancy** — Don’t overcomplicate with too many APIs at once. Ship the simplest creative workflow tool that works.  
- **Clear creative flow** — Every step in the UX should feel intuitive and inspire creative output (music → film → fashion → moodboard).  
- **Transparency in development** — Maintain clear commits, updated documentation, and traceable design choices.  


## Process

### 1. Planning & Staging

Break into 4 major stages:

#### Stage 1: Core Playlist Engine
**Goal**: User enters favorites (songs, artists, mood keywords) → curated Spotify playlist.  
**Success Criteria**: Playlist is generated and embedded; embedding similarity works for mapping vibes to music tags.  
**Tests**: Verify API calls return correct tracks, validate embeddings align with genres.  
**Status**: Not Started  

#### Stage 2: Film + Fashion Recommender
**Goal**: Add TMDb (films) and Unsplash/Tumblr (fashion + moodboard imagery).  
**Success Criteria**: User enters films/designers → system outputs curated film posters and fashion/moodboard images.  
**Tests**: Verify tag normalization pipeline, confirm recommendations are unique and relevant.  
**Status**: Not Started  

#### Stage 3: Moodboard Generator
**Goal**: Auto-curate a cross-modal board (music + film + fashion + visuals).  
**Success Criteria**: Given inputs, the system returns a cohesive board with multiple media types.  
**Tests**: Confirm API calls succeed, evaluate “aesthetic fit” through similarity metrics.  
**Status**: Not Started  

#### Stage 4: Hybrid Creative Workflow + Agent
**Goal**: Wrap everything in a chat-based AI agent (Claude/GPT).  
**Success Criteria**: User can either (a) fill a structured form OR (b) chat with AI → consistent curated outputs.  
**Tests**: Compare outputs from structured vs chat; ensure stability across workflows.  
**Status**: Not Started  

### 2. Implementation Flow
1. **Understand**: Review Spotify, TMDb, Unsplash, Tumblr APIs and model docs.  
2. **Test**: Write mock tests for each API integration (e.g., Spotify call returns playlist).  
3. **Implement**: Start with Spotify playlist generation → expand to films and fashion.  
4. **Refactor**: Modularize into `music.ts`, `film.ts`, `fashion.ts`, `moodboard.ts`.  
5. **Branching**: Create a new Git branch for each major feature (e.g., `feature/spotify-integration`, `feature/tmdb-films`). Merge via pull requests after review.  
6. **Commit**: Write incremental commits with clear messages tied to features.  


## Technical Standards

### Stack

**Frontend**  
- Next.js (App Router) + Tailwind CSS  

**Backend / Models**  
- Next.js API routes (serverless)  
- CLIP (open weights) for embeddings  
- Sentence-Transformers for text similarity  
- Optional: LoRA adapters for consistent aesthetic fine-tuning  

**APIs**  
- Spotify API (music)  
- TMDb API (films)  
- Unsplash API (fashion/moodboard photos)  
- Tumblr API (aesthetic/community-sourced imagery)  

**Database / Storage**  
- Supabase (PostgreSQL for users, boards, embeddings)  
- Cloudinary (for images and generated visuals)  

**Agent Layer**  
- Claude / OpenAI / Llama-based LLM for conversational workflow orchestration  
- Unified orchestration: “creative director agent”  


### Error Handling
- Fail fast if API keys are invalid  
- Graceful fallback if embeddings don’t map well  
- Provide backup recommendations when APIs return incomplete data  

### Decision Framework
When stuck:  
1. Start with Spotify integration only → expand later  
2. Choose readability over complex pipelines  
3. Prioritize user-facing value (playlist + visual board) before advanced ML  

## Quality Gates
- All tests pass for each API integration  
- Clear commit messages per feature  
- Features developed in their own branches, merged only after validation  
- Documentation updated (`PRD.md`, `SPRINT_PLAN.md`)  
- Project deployable on Vercel with functional demo  

## Example Repo Commit & Branch Plan
- `feat: init repo, add README + CLAUDE.md` (main branch)  
- **Branch**: `feature/spotify-integration` → `feat: add Spotify integration for playlist generation`  
- **Branch**: `feature/clip-mapping` → `feat: add CLIP embedding → music tag mapping`  
- **Branch**: `feature/tmdb-films` → `feat: add TMDb film recommendation system`  
- **Branch**: `feature/unsplash-tumblr` → `feat: add Unsplash/Tumblr fashion + moodboard integration`  
- **Branch**: `feature/export` → `feat: implement board export (PDF + share link)`  
- **Branch**: `feature/agent-integration` → `feat: integrate Claude agent for chat-based workflow`  
- `chore: add eval logs + update documentation`  
