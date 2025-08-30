# PRD – Palette (AI-Powered Aesthetic Translator)

## Product Idea Summary
Palette is an AI-powered creative workflow app that translates **products and companies into aesthetic moodboards and briefs** with visuals, playlists, cultural references, and copy.  

Users can:  
- Upload **brand guidelines, product docs, or pitch decks** → Palette uses RAG (Retrieval-Augmented Generation) to ground outputs in brand fonts, colors, and product messaging.  
- Or simply enter a **logo, one-liner description, or product image** in chat → Palette generates aesthetic boards contextualizing the brand within familiar Gen Z/Millennial aesthetics.  

The result: **deck-ready vibe boards and campaign briefs** that save strategists, creators, and founders hours of manual curation while ensuring cultural fluency.  

## Target Users
- **Startups & early-stage companies** → contextualize products and brands for campaigns, recruiting, or investors.  
- **Brand strategists & marketers** → campaign-ready vibe packs.  
- **Creative directors & agencies** → client pitches and campaign ideation.  
- **Content creators & influencers** → brand collab positioning.  


## Context / Motivation
We are living in a time of **product overload**: every day new brands, apps, collectibles, and startups are launched.  
- It’s hard for strategists and consumers to **contextualize new products** within cultural trends.  
- Brands struggle to **position themselves for Gen Z and Millennials**, who filter the world through aesthetics (“starter packs,” “cores,” “vibes”).  
- Manual moodboard curation takes hours/days and often feels disconnected from cultural fluency.  

**Palette bridges that gap by:**  
- Translating brand inputs (guidelines or simple prompts) into aesthetic boards.  
- Showing products **next to familiar cultural cues** (films, music, fashion, memes).  
- Delivering both **visual inspiration** and **copywriting outputs** (hashtags, captions, taglines).  


## Goals
- **Reduce time-to-deck**: turn days of curation into minutes.  
- Allow **flexible input modes** (lightweight prompt or full RAG-based brand pack).  
- Deliver outputs that are **shareable, editable, and campaign-ready**.  
- Make unfamiliar products **instantly relatable** through cultural association.  


## Use Cases
1. **Startup founder** uploads a PDF pitch deck + logo → Palette generates *Tech Bro Starter Pack* and *Gen Z Hacker Core* vibe boards, grounded in their color palette and product story.  
2. **Toy brand** uploads just a product photo (*Labubu*) → Palette outputs *Coquette x Collectible Core* vibe board with Sanrio references, Spotify playlists, and post hooks.  
3. **AI infra company** (Windsurf) pastes one-liner *“AI infra for startups”* → Palette generates a *Gen Z Hacker/Builder aesthetic* board with visuals, hashtags, and tagline *“Build at windspeed.”*  
4. **Agency strategist** uploads client brand guidelines → Palette generates moodboards aligned to client fonts/colors, but framed in aesthetics like *Clean Girl Minimalism* or *Cyberpunk Core*.  


## Features (MVP Scope)

### Inputs
- **Option A: Lightweight prompt**  
  - Logo (image upload).  
  - One-liner description (text).  
  - Optional: product photo.  

- **Option B: Brand doc upload (RAG mode)**  
  - PDFs: brand guidelines, product decks, examples.  
  - Palette extracts color schemes, fonts, messaging → guides outputs.  

- **Shared settings:**  
  - Audience (Gen Z / Millennials / Both).  
  - Platform (Instagram, TikTok, LinkedIn, etc.).  
  - Output type (Moodboard, Campaign Brief, Creative Deck).  

### Outputs
- **Visuals** → curated moodboard images (Unsplash, Tumblr).  
- **Music** → Spotify playlists via vibe tags.  
- **Cultural references** → films, memes, subcultures (TMDb/LLM).  
- **Copy** → hashtags, captions, post hooks, taglines (LLM).  
- **Rationale** → why this vibe matches product/audience.  
- **Export** → shareable link or downloadable PDF deck.  
- **Editable board** → swap visuals, text, playlists.  

---

## Stretch Features
- **Stable Diffusion + LoRA adapters** → render products/logos into aesthetic contexts.  
- **Analytics integration** → predict engagement by vibe/platform.  
- **Collaboration mode** → multiple users edit/share boards.  
- **API mode** → embed Palette’s aesthetic translator into other marketing/creative SaaS.  

---

## Technical Stack
- **Frontend:** Next.js (App Router) + Tailwind CSS  
- **Backend/API:** Next.js API routes or FastAPI microservice  
- **Integrations (MVP):** Spotify, Unsplash, Tumblr, TMDb/IMDb  
- **AI Models:**  
  - CLIP for embeddings.  
  - Sentence-Transformers for similarity.  
  - Claude/GPT for copy + rationale.  
  - RAG pipeline for PDF/brand doc grounding.  
  - (Stretch) Stable Diffusion + LoRA for generated visuals.  
- **Database/Storage:** Supabase (users, boards), Cloudinary (images)  
- **Export:** Puppeteer (HTML → PDF), shareable links  
- **Deployment:** Vercel + Hugging Face Spaces  


## Success Metrics
- % of users using **brand doc upload** vs lightweight prompt.  
- % of boards exported/shared in decks.  
- Time saved (manual vs Palette).  
- Qualitative feedback on **aesthetic accuracy + cultural fit**.  


## Risks & Challenges
- **Cold start**: must seed Palette with a taxonomy of aesthetics.  
- **Data extraction**: brand PDFs vary in structure; RAG may misinterpret.  
- **Quality**: outputs must feel authentic to Gen Z culture.  
- **Perception**: must show value as a **workflow tool**, not novelty generator.  


## Next Steps
1. Build lightweight input flow (logo + one-liner → board).  
2. Add PDF brand doc upload + RAG pipeline.  
3. Integrate Spotify + Unsplash + Tumblr APIs for first outputs.  
4. Export/share features (PDF, link).  
5. User test with startup founders + brand strategists.  
6. Stretch: LoRA-generated product visuals.  
