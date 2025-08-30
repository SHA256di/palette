# PRD – Palette (Creative Workflow Copilot)

## Product Idea Summary
Palette is an AI-powered creative workflow web app that generates **ready-to-use inspo packs** for campaigns, posts, or personal projects. Instead of juggling Spotify, TMDb/IMDb, Unsplash, and Pinterest separately, Palette centralizes playlists, visuals, cultural references, hashtags, and post ideas into a **sharable one-page brief**.  

Users can:
- Input a vibe or aesthetic (*“pink pilates princess”*, *“indie sleaze”*) and optional campaign goal.  
- Choose audience (Gen Z, Millennials, or both) and platform (LinkedIn, Instagram, Facebook, TikTok).  
- Select output type: Campaign Mock-up, Shoot Ideas, or Set Design Brief.  
- Instantly receive a curated inspo pack with playlist, visuals, film refs, hashtags/keywords, post hooks, and rationale.  
- Export as a shareable link or downloadable PDF/slidedeck.  

## Target Users
- **Brand strategists & marketers** → vibe packs for campaign decks & ad content.  
- **Creative directors & designers** → shoot/set ideas aligned with cultural aesthetics.  
- **Content creators** → quick inspo for TikTok/Instagram posts.  
- **Gen Z creatives & students** → personal aesthetic exploration for projects.  
- **B2B marketers** → campaigns that feel culturally fluent to younger audiences.  


## Context / Motivation
Creative workflows today are **fragmented**: users bounce between ChatGPT (text), Pinterest (visuals), Spotify (music), and Canva (execution).  
- ChatGPT can list ideas, but it doesn’t output *real assets*.  
- Canva gives templates, but not Gen Z-native vibes.  

Palette reduces friction by:  
- Automating **cross-modal discovery** (music, film, visuals, text).  
- Centralizing outputs into **workflow-ready briefs**.  
- Acting as a **cultural translator**, making campaigns vibe-native for Gen Z & Millennials.  


## Goals
- Deliver a **seamless creative workflow** for campaigns & posts.  
- Provide personalization by **purpose, platform, and audience**.  
- Support both **strategic use cases** (campaign decks, ad mockups) and **creative exploration**.  
- Showcase AI as a **collaborative co-pilot**, not just a recommender.  


## Use Cases
- A **brand strategist** inputs “coastal grandmother,” selects *LinkedIn campaign*, and gets a brief with posts + hashtags for professional wellness branding.  
- A **content creator** selects “indie sleaze,” *Instagram personal project*, and receives a moodboard, playlist, and meme captions.  
- A **set designer** chooses “cyberpunk fintech,” *shoot ideas*, and Palette outputs visual references + film stills + set design prompts.  
- A **small business owner** selects “pink pilates princess,” *campaign mock-up*, *Gen Z audience*, and gets LinkedIn ad ideas, hashtags, and visuals ready to drop into Canva.  


## Features (MVP Scope)
- **Inputs:**  
  - Vibe/Aesthetic (text field)  
  - Audience (Gen Z / Millennials / Both)  
  - Purpose (Personal / Campaign)  
  - Platform (LinkedIn, Instagram, Facebook, TikTok)  
  - Output Type (Campaign Mock-up, Shoot Ideas, Set Brief)  

- **Outputs:**  
  - Playlist (Spotify embeds)  
  - Film/Media references (TMDb API)  
  - Moodboard images (Unsplash/Tumblr API)  
  - Hashtags & keywords (LLM generated, audience-specific)  
  - Post ideas/hooks (LLM generated, platform-specific)  
  - AI rationale (“why these elements fit your vibe & audience”)  
  - Exportable as **shareable link** or **PDF/slidedeck**  


## Stretch Features
- **Stable Diffusion + LoRA adapters** for generating aesthetic visuals (custom vibes: *dark academia*, *pink pilates princess*).  
- **Campaign analytics integration**: engagement predictions based on post type + hashtags.  
- **Pinterest/Instagram login**: generate boards from user pins or saved posts.  


## Technical Stack
**Frontend**: Next.js (App Router) + Tailwind CSS  
**Backend/API**: Next.js API routes or FastAPI microservice for embeddings & orchestration  

**Integrations (MVP):**  
- Spotify API (music)  
- TMDb API (films)  
- Unsplash API (visuals)  
- Tumblr API (aesthetic content)  

**AI Models:**  
- CLIP (Hugging Face) for embeddings & vibe matching  
- Sentence-Transformers for text similarity  
- Claude / GPT-4 / LLaMA-3 for rationale, hashtags, and post ideas  
- Stable Diffusion (stretch) for generated images  
- LoRA (stretch) for fine-tuned aesthetics  

**Database/Storage:** Supabase/Postgres (users, boards), Cloudinary (images)  
**Export:** Puppeteer (HTML → PDF), dynamic routes for shareable links  
**Deployment:** Vercel (frontend + serverless), Hugging Face Spaces (AI hosting)  


## Success Metrics
- **Adoption:** % of users generating ≥2 inspo packs/week  
- **Cross-modal use:** % of packs containing music + film + visuals  
- **Export/share rate:** # of packs shared as links or downloads  
- **Engagement fit:** qualitative feedback (“Did this feel culturally on point?”)  
- **Time saved:** avg. minutes saved vs manual workflow  


## Risks & Challenges
- API limitations (Spotify rate limits, Tumblr/Pinterest access).  
- Convincing users Palette is a **workflow enhancer, not a novelty toy**.  
- Balancing cultural aesthetics with business needs.  
- Cold-start: new users may not know which vibes to input.  


## Next Steps
1. Build structured form workflow (input → inspo pack).  
2. Integrate Spotify + TMDb + Unsplash APIs.  
3. Render output in clean web layout with export/share options.  
4. Add AI-generated rationale, hashtags, and post ideas (audience/platform-specific).  
5. Test with 3–5 creatives/marketers for impact stories.  
6. Stretch: add Stable Diffusion LoRA for unique generated visuals.  u

✨ *Created with ChatPRD, ChatGPT, and Shawdi.*  
