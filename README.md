# palette 🎨 : a creative workflow curator
**palette** is an AI-powered creative workflow app that helps users go from vibe → curated inspo pack in minutes. Instead of spending hours manually pulling references across Spotify, Pinterest, and film databases, palette generates a campaign-ready board with playlists, films, visuals, hashtags, post ideas, and a rationale tying everything together.  

Boards can be exported as a shareable link or PDF/slidedeck, making them instantly usable for campaign decks, creative pitches, or content planning.  


## How It Works

1. **Input**  
   Users provide a vibe or aesthetic (e.g., "pink pilates princess", "indie sleaze") plus context:  
   - Purpose: Personal project or Campaign  
   - Audience: Gen Z, Millennials, or Both  
   - Platform: LinkedIn, Instagram, Facebook, TikTok  
   - Output Type: Campaign Mock-up, Shoot Ideas, or Set Design Brief  

2. **AI Curation**  
   palette expands the vibe into structured tags using embeddings (CLIP + sentence-transformers) and LLM reasoning. It then pulls assets via APIs:  
   - Spotify API → curated playlist embeds  
   - TMDb API → films, stills, and references  
   - Unsplash/Tumblr APIs → moodboard visuals  
   - LLM → hashtags, keywords, post hooks, rationale  

3. **Output**  
   palette renders a campaign-ready inspo pack:  
   - Playlist (Spotify embed)  
   - Film/Media references (TMDb posters + metadata)  
   - Moodboard visuals (Unsplash/Tumblr)  
   - Hashtags & keywords (audience + platform-specific)  
   - Post ideas/hooks (campaign-ready)  
   - Rationale (explaining why these assets fit the vibe and goal)  

4. **Export**  
   - Copy shareable link (`/board/[id]`)  
   - Download PDF/slidedeck (via Puppeteer export)  


## Example Output: Pink Pilates Princess (Gen Z, LinkedIn, Campaign Mock-up)

- Playlist: Gracie Abrams, Ariana Grande, Ethel Cain  
- Film/References: Barbie (2023), Legally Blonde  
- Visuals: pastel pilates studios, bows and scrunchies, matcha lattes  
- Hashtags: #PilatesPrincess #Balletcore #GenZWellness  
- Post Ideas:  
  1. Carousel: "Wellness is the new hustle: what startups can learn from the Pilates Princess"  
  2. Video: CEO POV walking into the office in pink athleisure with text overlay: "Balance isn’t a luxury. It’s Gen Z’s demand."  
  3. Meme: side-by-side comparison of a pilates studio and a startup pitch deck  
- Rationale: Gen Z resonates with irony and micro-aesthetics. This pack reframes wellness as ambition, using Barbiecore and pilates visuals to connect with younger professionals on LinkedIn.  


## Target Users
- Brand strategists and marketers creating campaign decks and ads  
- Creative directors and designers seeking aesthetic-aligned shoot/set references  
- Content creators looking for fast, ready-to-use inspiration packs  
- Students and Gen Z creatives exploring aesthetics quickly  


## Tech Stack

**Frontend**  
- Next.js (App Router) + Tailwind CSS  

**Backend / API**  
- Next.js API routes (serverless) or Python microservice (for embeddings)  
- Spotify API (music)  
- TMDb API (films/media)  
- Unsplash API (visuals)  
- Tumblr API (aesthetic imagery)  

**AI Models**  
- CLIP (Hugging Face) for vibe embeddings  
- Sentence-Transformers for text → tag mapping  
- Claude / GPT-4 / LLaMA-3 for rationale, hashtags, and hooks  
- (Stretch) Stable Diffusion + LoRA adapters for generated visuals  

**Database / Storage**  
- Supabase (Postgres for users and boards)  
- Cloudinary (for storing images and exports)  

**Export**  
- Dynamic routes for shareable boards (`/board/[id]`)  
- Puppeteer for HTML → PDF deck export  

**Deployment**  
- Vercel (frontend + serverless)  
- Hugging Face Spaces (for ML hosting/experiments)  



## Roadmap
1. MVP: Spotify + TMDb + Unsplash integrations, generate boards, export PDF/share link  
2. Personalization: Inputs for audience, purpose, and platform; tailored hashtags and post ideas  
3. Refinement: Iterative tweaks ("make it darker", "more ironic")  
4. Stretch Features: LoRA-based aesthetic adapters, Pinterest/Tumblr OAuth, engagement prediction dashboard  



## Success Criteria
- Users generate boards in under 2 minutes  
- Export (link + PDF) works reliably  
- Outputs feel culturally fluent and platform-appropriate  
- Early testers confirm palette saves 30–60 minutes vs manual workflows  



## Demo Path (for 60-second APB video)
1. Landing page → click "Create a Board"  
2. Input vibe, audience, platform → click "Generate"  
3. Board renders: playlist, films, visuals, hashtags, post ideas, rationale  
4. Export PDF and copy share link  
5. Adjust prompt (e.g., "make it more futuristic") → regenerated board  


