# palette 🎨 : a creative workflow curator
palette is a creative workflow web app that helps users materialize a vibe or aesthetic into a curated board in seconds. Instead of spending hours manually pulling references across music, film, and moodboard platforms, users can enter a few favorites, and palette generates a shareable aesthetic board with playlists, films, fashion brands, moodboard images, and a rationale tying them together.

The app works in two modes:

## Structured Workflow
Users fill out a clean form with their favorite songs, movies, and designers. palette then uses embeddings (CLIP + sentence-transformers) and APIs (Spotify, TMDb, Unsplash, Tumblr) to build a personalized cross-media recommendation set.

## Creative Assistant
A chat-based AI curator lets users free-prompt their vision (e.g., “dreamy indie, Sofia Coppola vibes with a Y2K twist”). The AI parses this into structured tags and regenerates a curated board, supporting iterative feedback loops like “make it darker” or “lean more futuristic.”

Each board is deck-ready: users can view Spotify embeds, film posters (via TMDb/IMDb), brand references, and visual inspiration side by side. Boards can be exported as a PDF deck or shared with a link — making it ideal for creative directors, brand strategists, set designers, or content creators.

---

## Target Users
- Gen Z and creative professionals (brand strategists, production/set designers, content creators)  
- People who want to go from vibe → board fast (hours of manual curation compressed into minutes)  
- Creative directors prepping campaign pitches  
- Students and personal creators exploring aesthetics  

## Tech Stack

**Frontend**  
- Next.js (App Router) + Tailwind CSS  

**Backend / API**  
- Next.js API routes (serverless) or small Python microservice (for embeddings)  

**Auth & Integrations (MVP)**  
- Spotify API (music search + playlist generation)  
- TMDb API (films, with IMDb IDs for metadata cross-reference)  
- Unsplash API (fashion/moodboard photos)  
- Tumblr API (aesthetic/community-sourced vibe content)  

**Auth & Integrations (Future Features)**  
- Spotify login → personalized recommendations based on user playlists  
- Pinterest login → vibe boards generated from existing pins  
- Tumblr login → curated aesthetics based on followed blogs/tags  

**AI Models**  
- CLIP (Hugging Face) for embeddings & aesthetic matching  
- Sentence-Transformers for text similarity  
- Claude / OpenAI / Llama-based LLM for tag cleaning, rationale, and assistant mode  
- (Stretch) Stable Diffusion for generating moodboard visuals  
- (Stretch) LoRA adapters for consistent style transfer  

**Database / Storage**  
- Supabase / PostgreSQL (users, boards, embeddings, connections)  
- Cloudinary / Uploadcare for images  

**Analytics / Evals**  
- PostHog for events  
- Custom eval panel (vibe alignment, tag overlap, time saved)  

**Deployment**  
- Vercel (frontend + serverless) and/or Hugging Face Spaces  

## Workflow

### Structured Mode (Form)
- User manually enters favorites (music, films, designers)  
- Inputs normalized with LLM (deduped, cleaned)  
- Map inputs to embeddings and retrieve candidates (Spotify, TMDb, Unsplash, Tumblr)  
- Rank matches by cosine similarity + filters (aesthetic, energy, era)  
- Generate curated board → save to DB → render on UI  
- Export PDF, copy share link, or duplicate board  
- (Stretch) Apply trained LoRA aesthetic adapters to re-render moodboard visuals in the requested style (e.g., Wes Anderson, dark academia)  

### Assistant Mode (Chat)
- User prompts an aesthetic or vibe (e.g., “dreamy indie, Sofia Coppola vibes”)  
- AI parses into structured tags (genres, aesthetics, brands, directors)  
- Run through same retrieval pipeline as above  
- Return curated board + rationale  
- AI stays in the loop for iteration (“make it darker”, “more futuristic”)  
- (Stretch) Enable iterative refinement using LoRA adapters that apply different trained aesthetics with each adjustment  

## Core Features
- Curated Board Output: playlist (Spotify embed), films (posters/loglines), fashion (logos/moods), moodboard images, AI rationale  
- Eval Panel: vibe alignment score, tag coverage, similarity metrics  
- Exports: PDF deck, public share link with OG preview  
- Creative Assistant: chat-based exploration with refinement loops  

## Stretch Features (LoRA)
- LoRA-based aesthetic adapters: fine-tuned lightweight models trained on curated datasets (e.g., dark academia, Y2K fashion, film noir posters) to generate visuals with consistent style and cohesion  
- Designer & brand style LoRAs: train adapters on small image sets from fashion designers (e.g., Prada, Rick Owens) to reflect designer-specific aesthetics in moodboard outputs  
- Film poster LoRAs: fine-tune on groups of film posters by genre so that outputs reflect cinematic styles  
- Eval integration: compare baseline visuals vs. LoRA outputs with similarity scores and vibe alignment metrics  

## Future Enhancements
- Pinterest / Tumblr OAuth logins for personalized recommendations from user data  
- Spotify login for playlist-based taste modeling  
- Collaborative boards (multi-user edits)  
- Advanced eval dashboard (track time saved, creative overlap)  
- A curated LoRA visual style library (users can toggle between dark academia, streetwear, film noir, etc.)  
