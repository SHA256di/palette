# Palette – 7 Day Sprint Plan

## Sprint Goal
Deliver a **minimum viable product (MVP)** of Palette: a creative workflow copilot that generates curated inspo packs (playlist, film refs, visuals, hashtags, post ideas, rationale) and renders them into a **cohesive moodboard layout**.  
By the end of the sprint: a **live deployed demo** where a user can input a vibe/product/company → receive a rendered board (music, film, visuals, text) exportable as **shareable link or PDF/PNG**.

---

## Day 1 – Project Setup & Spotify Integration
**Objectives**
- Initialize GitHub repo with README, CLAUDE.md, PRD.md.  
- Configure `.gitignore` and environment variables (`.env`).  
- Set up Next.js + Tailwind CSS frontend.  
- Deploy baseline scaffold to Vercel.  
- Implement Spotify API integration for playlist generation.  

**Deliverables**
- Repo initialized + deployed (Vercel).  
- User can input a vibe/keyword → system fetches curated playlists via Spotify API.  

---

## Day 2 – TMDb Film Integration & Vibe Mapping
**Objectives**
- Connect TMDb API for film metadata and posters based on vibe input.
- Implement vibe → genre mapping using CLIP or Sentence-Transformers embeddings.
- Map user vibes to film genres/decades for culturally accurate references.
- Display curated film posters and metadata on frontend.

**Deliverables**
- User can type a vibe/aesthetic → relevant films appear with posters.
- Feature branch merged (`feature/tmdb-integration`).

---

## Day 3 – Spotify Playlist & Album Cover Integration
**Objectives**
- Re-enable Spotify API integration for playlist generation (5 songs per genre).
- Connect Discogs API with **hybrid thematic + visual approach**:
  - Primary: Map vibe → music genres/eras → query Discogs for thematically relevant albums
  - Secondary: Apply basic visual filters (brightness, color tone) for moodboard coherence
- Implement vibe mapping pipeline: user input → CLIP embeddings → Spotify genres + Discogs album matching.
- Display curated playlist + culturally accurate album covers.

**Deliverables**
- User enters vibe → Spotify playlist + thematically matched album covers appear.
- Albums are culturally accurate (meaning > pure visual matching).
- Feature branch merged (`feature/spotify-discogs`).  

---

## Day 4 – Moodboard Layout System (Core MVP)
**Objectives**
- Integrate Unsplash API for aesthetic photos.  
- Integrate Tumblr API for niche aesthetic imagery.  
- Define **Moodboard Layout Schema**:
  - Title vibe (large centered text).  
  - Mix of media types: posters, album covers, product images, quotes.  
  - Randomized placement/rotation for collage feel.  
  - White/gradient background.  
- Implement frontend rendering with Fabric.js or Konva.js.  
- Export moodboard as PNG for MVP.  

**Deliverables**
- User input → moodboard generated with playlist, films, visuals, album covers, and text in **collage template**.  
- Feature branch merged (`feature/moodboard-layout`).  

---

## Day 5 – Workflow Inputs + Export Layer
**Objectives**
- Add input fields:  
  - Vibe/Aesthetic (text field)  
  - Audience (Gen Z / Millennials / Both)  
  - Purpose (Personal / Campaign)  
  - Platform (LinkedIn, Instagram, TikTok, etc.)  
  - Output Type (Moodboard, Campaign Mock-up, Shoot Ideas, Set Brief)  
- Generate hashtags, post ideas, rationale with Claude/GPT.  
- Implement export features:  
  - Shareable link (`/board/[id]`)  
  - PDF/slidedeck via Puppeteer  
  - PNG collage export (from moodboard layout).  
- Connect Supabase to save boards + metadata.  

**Deliverables**
- User can generate tailored inspo packs and export them.  
- Export via link, PDF, and PNG works.  
- Feature branches merged (`feature/export`, `feature/workflow-inputs`).  

---

## Day 6 – AI Assistant Integration
**Objectives**
- Add Claude/GPT API for conversational workflow.  
- Orchestrate pipeline: chat input → structured tags → board generation.  
- Support refinements (e.g., *“make it more futuristic”*, *“lean more Gen Z”*).  
- Compare chat vs form outputs for consistency.  

**Deliverables**
- Functional chat assistant generating boards.  
- Feature branch merged (`feature/agent-integration`).  

---

## Day 7 – Testing, Polish & Demo
**Objectives**
- Test end-to-end workflows (form + chat + export).  
- Conduct quick user testing (2–3 brand strategists/content creators).  
- Polish UI with Tailwind components + clean aesthetic (white background, collage style).  
- Record 60-second demo video (problem → input → moodboard output → export).  
- Update docs (README, PRD, CLAUDE.md, Sprint Plan).  
- Deploy final build to Vercel (`palette.querate.ai`).  

**Deliverables**
- Live, polished MVP deployed and shareable.  
- Demo video recorded and linked in README.  

---

## Stretch Features (Post-MVP)
- **LoRA-based visual adapters**: fine-tuned collages for aesthetics (*dark academia, Y2K, pink pilates princess*).  
- **Brand guideline ingestion (RAG)**: upload brand PDF or color/font schema to guide board output.  
- **Interactive editor**: drag/drop to tweak elements on moodboard before exporting.  
- **Campaign analytics integration**: predict engagement (hashtags × post type).  
- **Pinterest/Instagram login**: auto-generate boards from user pins/saves.  

---

## Success Criteria
- User can generate a **cross-modal moodboard** (music, film, visuals, text, album covers) in <2 minutes.  
- Moodboard exports as **PNG/PDF** and is **shareable via link**.  
- Inputs for purpose, audience, and platform meaningfully change outputs.  
- Chat and form workflows both functional.  
- Repo + docs clean, professional, recruiter-ready.  
