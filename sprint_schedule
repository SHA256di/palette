# palette – 7 Day Sprint Plan

## Sprint Goal
Deliver a minimum viable product (MVP) of palette, a creative workflow app that curates cross-modal boards (music, film, fashion, visuals).  
By the end of the sprint: a live deployed demo where a user can generate and export a curated board via structured input or chat.

---

## Day 1 – Project Setup & Spotify Integration
**Objectives**
- Initialize GitHub repo with README, CLAUDE.md, PRD.md.
- Configure `.gitignore` and environment variables (`.env`).
- Set up Next.js + Tailwind CSS frontend.
- Set up Supabase database and Cloudinary account.
- Implement Spotify API integration for playlist generation.

**Deliverables**
- Repo initialized and deployed on Vercel.
- Spotify API returning playlists for seed inputs.

---

## Day 2 – Embeddings & Music Workflow
**Objectives**
- Add CLIP or Sentence-Transformers embeddings for vibe matching.
- Implement mapping between tags → genres → playlists.
- Display curated playlists on frontend via Spotify embeds.
- Write unit tests for Spotify module.

**Deliverables**
- User can enter songs or mood tags → receive curated Spotify playlist.
- Feature branch merged (`feature/spotify-integration`).

---

## Day 3 – Film Recommendation Integration
**Objectives**
- Connect TMDb API for film metadata and recommendations.
- Build normalization script for genre tags.
- Display curated film posters and descriptions on board.
- Write tests for film recommendation flow.

**Deliverables**
- User can input favorite films → system recommends related films.
- Feature branch merged (`feature/tmdb-films`).

---

## Day 4 – Fashion / Moodboard Integration
**Objectives**
- Integrate Unsplash API for aesthetic imagery.
- Integrate Tumblr API for community/aesthetic imagery.
- Deduplicate and clean fetched images.
- Render film posters, playlists, and moodboard images together on board.

**Deliverables**
- Working prototype board with music, films, and visuals.
- Feature branch merged (`feature/unsplash-tumblr`).

---

## Day 5 – Export & Database Integration
**Objectives**
- Store boards in Supabase (user, inputs, outputs, embeddings).
- Implement export features: PDF deck, shareable link.
- Configure Cloudinary for storing board images.
- Add PostHog analytics for user events (board created, board exported).

**Deliverables**
- Board can be saved, exported as PDF, and shared.
- Feature branch merged (`feature/export`).

---

## Day 6 – AI Creative Assistant Integration
**Objectives**
- Add Claude/GPT API for chat-based workflow.
- Build orchestration pipeline: chat → structured tags → board generation.
- Implement iterative refinement (“make it darker,” “lean more futuristic”).
- Compare chat outputs vs. form inputs for consistency.

**Deliverables**
- Functional chat assistant generating boards.
- Feature branch merged (`feature/agent-integration`).

---

## Day 7 – Testing, Polish & Demo
**Objectives**
- Test full end-to-end workflows (form + chat).
- Conduct user testing with 2–3 creatives for feedback.
- Polish UI with Tailwind components.
- Record 60-second demo video (problem → workflow → output).
- Update documentation (README, PRD, CLAUDE.md).
- Deploy final build to Vercel (`palette.querate.ai` or subdomain).

**Deliverables**
- Live, polished MVP deployed and shareable.
- Demo video recorded and linked in README.

---

## Success Criteria
- User can create a cross-modal board with music, film, and visuals in under 2 minutes.
- Export and share features work reliably.
- Both structured workflow and chat assistant produce usable outputs.
- Documentation and repo are professional, clean, and recruiter-ready.
