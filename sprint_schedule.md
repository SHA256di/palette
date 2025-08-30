# palette – 7 Day Sprint Plan

## Sprint Goal
Deliver a **minimum viable product (MVP)** of palette: a creative workflow copilot that generates curated inspo packs (playlist, film refs, visuals, hashtags, post ideas, rationale).  
By the end of the sprint: a **live deployed demo** where a user can input a vibe + context (purpose, audience, platform) and export a one-page board via **shareable link or PDF/slidedeck**.

## Day 1 – Project Setup & Spotify Integration
**Objectives**
- Initialize GitHub repo with README, CLAUDE.md, PRD.md.  
- Configure `.gitignore` and environment variables (`.env`).  
- Set up Next.js + Tailwind CSS frontend.  
- Deploy baseline app scaffold to Vercel.  
- Implement Spotify API integration for playlist generation.  

**Deliverables**
- Repo initialized + deployed (Vercel).  
- User can input a mood/keyword → system fetches playlists via Spotify API.  


## Day 2 – Vibe Mapping & Music Workflow
**Objectives**
- Add CLIP or Sentence-Transformers embeddings for vibe → genre matching.  
- Implement mapping pipeline: vibe input → tags → Spotify playlist.  
- Display curated playlists on frontend with Spotify embeds.  
- Unit test Spotify + embeddings module.  

**Deliverables**
- User can type a vibe/aesthetic → curated playlist appears.  
- Feature branch merged (`feature/spotify-integration`).  

## Day 3 – Film Recommendation Integration
**Objectives**
- Connect TMDb API for film metadata and recommendations.  
- Normalize genres between vibe embeddings and TMDb tags.  
- Display curated film posters + metadata on board.  
- Test film recommendation pipeline.  

**Deliverables**
- User enters vibe → film references populate on board.  
- Feature branch merged (`feature/tmdb-films`).  

## Day 4 – Visuals & Moodboard Integration
**Objectives**
- Integrate Unsplash API for aesthetic photos.  
- Integrate Tumblr API for niche aesthetic imagery.  
- Deduplicate/clean images with simple filter.  
- Render full inspo board: playlist + films + visuals.  

**Deliverables**
- Board shows music + film + visuals together.  
- Feature branch merged (`feature/unsplash-tumblr`).  


## Day 5 – Audience/Platform Inputs + Export Layer
**Objectives**
- Add input fields: Purpose (personal/campaign), Audience (Gen Z/Millennials/both), Platform (LinkedIn/Instagram/Facebook/TikTok), Output Type (mock-up/shoot/set).  
- Adjust hashtags, post ideas, rationale based on inputs (LLM).  
- Implement export features:  
  - Shareable link (`/board/[id]`)  
  - PDF/slidedeck via Puppeteer.  
- Connect Supabase to save boards + metadata.  

**Deliverables**
- User can generate tailored inspo pack based on audience/platform.  
- Board exportable via link and PDF.  
- Feature branch merged (`feature/export`, `feature/workflow-inputs`).  

## Day 6 – AI Assistant Integration
**Objectives**
- Add Claude/GPT API for conversational workflow.  
- Orchestrate pipeline: chat input → structured tags → board generation.  
- Support refinements (e.g., *“make it more futuristic”*, *“lean Gen Z”*).  
- Compare chat vs. form outputs for consistency.  

**Deliverables**
- Functional chat assistant generating boards.  
- Feature branch merged (`feature/agent-integration`).  

## Day 7 – Testing, Polish & Demo
**Objectives**
- Test full workflows (form + chat + export).  
- Conduct quick user testing (2–3 creatives/marketers).  
- Polish UI with Tailwind components + aesthetic layouts.  
- Record 60-second demo video (problem → input → output → impact).  
- Update docs (README, PRD, CLAUDE.md, Sprint Plan).  
- Deploy final build to Vercel (`palette.app` or subdomain).  

**Deliverables**
- Live, polished MVP deployed and shareable.  
- Demo video recorded and linked in README.  

## Success Criteria
- User can generate a cross-modal inspo pack (music, film, visuals, hashtags, post ideas, rationale) in <2 minutes.  
- Export (link + PDF/slidedeck) works reliably.  
- Inputs for purpose, audience, platform meaningfully change outputs.  
- Chat and form workflows both functional.  
- Repo + docs clean, professional, recruiter-ready.  
