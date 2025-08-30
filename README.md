# palette 🎨 : a creative workflow curator  

**palette** is an AI-powered web app that helps users turn a vibe, product, or aesthetic into a curated moodboard in seconds.  

Instead of manually pulling references from Spotify, TMDb, Discogs, Unsplash, and Tumblr, palette generates a **shareable aesthetic board** that combines playlists, films, album covers, visuals, quotes, and rationale into a single, deck-ready output.  

The app works in two modes:  

---

## Structured Workflow  
Users fill out a clean form with:  
- A vibe or product name (e.g., *“pink pilates princess”*, *“windsurf startup”*)  
- Optional brand context (audience, platform, purpose)  

Palette then uses embeddings (CLIP + sentence-transformers) and APIs (Spotify, Last.fm, TMDb, Discogs, Unsplash, Tumblr) to assemble a **cross-media board**.  

---

## Creative Assistant  
A chat-based AI curator lets users free-prompt their vision (e.g., “make me a *girlblogger aesthetic board* around Diet Coke”). The assistant parses the input into structured tags and regenerates a board with refinement loops like:  
- “Make it darker”  
- “More Y2K”  
- “Add Lana Del Rey references”  

---

## Output  
Each board is **moodboard-first**: a white-background collage layout with:  
- Spotify embeds + Last.fm tags (music)  
- Film posters/loglines (TMDb)  
- Album covers (Discogs)  
- Aesthetic visuals (Unsplash, Tumblr)  
- Quotes or phrases pulled from APIs or LLMs  
- Optional product placement (logos, new products contextualized among familiar items)  

Boards can be:  
- Exported as PDF/PNG slides  
- Shared via link  
- Iterated with AI  

---

## Target Users  
- **Brand strategists & marketers** → vibe packs for campaign decks & ad mockups  
- **Creative directors & designers** → quick inspo boards for set/campaign design  
- **Content creators** → aesthetic boards for TikTok/Instagram  
- **Gen Z creatives & students** → exploring and remixing aesthetics  
- **B2B marketers** → translating new products into familiar cultural contexts  

---

## Tech Stack  

**Frontend**  
- Next.js (App Router) + Tailwind CSS  
- Konva.js / Fabric.js for collage layout rendering  

**Backend / API**  
- Next.js API routes or small FastAPI microservice for embeddings  

**Integrations (MVP)**  
- Spotify API (music search + playlists)  
- Last.fm API (tags + vibe mapping)  
- TMDb API (films, metadata, posters)  
- Discogs API (album covers)  
- Unsplash API (general visuals)  
- Tumblr API (aesthetic/quote content)  

**Future Integrations**  
- Pinterest/Instagram login → vibe boards from saved pins  
- Spotify login → playlist-based personalization  
- Brand guideline upload (PDF/RAG) → color/font alignment  

**AI Models**  
- CLIP (Hugging Face) for embeddings & vibe matching  
- Sentence-Transformers for text similarity  
- Claude / GPT-4 / LLaMA for rationale, hashtags, quotes, and refinements  
- (Stretch) Stable Diffusion for AI-generated visuals  
- (Stretch) LoRA adapters for style-specific boards  

**Database / Storage**  
- Supabase (PostgreSQL for users, boards, embeddings)  
- Cloudinary (for storing images + exported boards)  

**Analytics / Evals**  
- PostHog for event tracking  
- Eval panel (tag overlap, vibe alignment, time saved)  

**Deployment**  
- Vercel (frontend + serverless)  
- Hugging Face Spaces (model hosting, optional)  

---

## Workflow  

### Structured Mode (Form)  
1. User enters vibe/product + context.  
2. Inputs normalized with LLM (deduped, cleaned).  
3. Pipeline retrieves candidates from Spotify, Last.fm, TMDb, Discogs, Unsplash, Tumblr.  
4. Elements ranked + assembled into collage layout template (images, text, album covers, quotes).  
5. User exports/share board.  

### Assistant Mode (Chat)  
1. User prompts aesthetic (“NYC finance starter pack with iced lattes”).  
2. AI generates structured tags (brands, genres, phrases).  
3. Same retrieval pipeline runs → outputs board.  
4. User refines via conversation.  

---

## Core Features  
- **Moodboard-first output**: playlist, films, album covers, images, quotes, rationale.  
- **Export tools**: PDF, PNG, shareable links.  
- **Creative Assistant**: chat-based refinement.  
- **Product contextualization**: place new products alongside familiar aesthetics.  

---

## Stretch Features  
- **LoRA adapters**: fine-tuned lightweight models for styles (*dark academia*, *girlblogger*, *Y2K*, *film noir*).  
- **Brand guideline upload (RAG)**: PDF ingestion to enforce fonts, colors, tone.  
- **Campaign analytics**: predict engagement by vibe/hashtags.  
- **Collaborative boards**: multi-user edits + commenting.  

---

## Future Enhancements  
- Personalized vibe packs via Spotify/Pinterest login.  
- Advanced eval dashboard (time saved, cross-modal overlap).  
- LoRA visual style library (toggle: dark academia, tech bro, streetwear, etc.).  
