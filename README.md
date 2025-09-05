# 🎨 Palette - AI Moodboard Generator

Generate beautiful aesthetic moodboards using AI image analysis and intelligent search.

## 🏗️ Architecture

This is a modern Next.js 14+ application with App Router, featuring:

- **Gemini Vision AI** for image analysis and aesthetic classification
- **Google Custom Search API** for fetching cohesive moodboard images  
- **5 Curated Aesthetics**: Pink Pilates Princess, Coquette, Clean Girl, Dark Academia, Y2K
- **WishlistLayout** for clean 2×2 moodboard display

## 📁 Project Structure

```
palette/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages & API routes
│   │   │   ├── api/
│   │   │   │   └── analyze-image/  # Main AI analysis endpoint
│   │   │   └── page.tsx     # Homepage
│   │   ├── components/      # React components
│   │   │   ├── ProductUpload.tsx
│   │   │   └── WishlistLayout.tsx
│   │   ├── lib/            # Utilities & integrations
│   │   │   ├── aesthetics.ts    # 5 curated aesthetics
│   │   │   ├── gemini.ts        # Gemini Vision API
│   │   │   └── google-search.ts # Google Images search
│   │   └── types/          # TypeScript interfaces
│   ├── public/             # Static assets
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
├── docs/                   # Project documentation
│   ├── PRD.md             # Product Requirements
│   ├── Claude_prompt.md   # AI instructions
│   └── sprint_schedule.md # Development timeline
└── README.md              # This file
```

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example and add your API keys
   cp .env .env.local
   ```

3. **Get API Keys:**
   - **Gemini API**: Get from Google AI Studio
   - **Google Search API**: Get from Google Cloud Console
   - **Custom Search Engine**: Create at Google Custom Search

4. **Update .env.local:**
   ```bash
   GEMINI_API_KEY=your-gemini-key-here
   GOOGLE_SEARCH_API_KEY=your-google-search-key
   GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## 🎯 How It Works

### User Workflow
1. **Upload** a product image
2. **Select** an aesthetic (or let AI auto-detect)
3. **Generate** moodboard
4. **View** your personalized 2×2 aesthetic grid

### Behind the Scenes
1. **Gemini Vision** analyzes the uploaded image
2. **AI classifies** the aesthetic and generates keywords
3. **Google Search** finds 8-12 matching images
4. **WishlistLayout** displays the cohesive moodboard

## 🎨 Supported Aesthetics

1. **Pink Pilates Princess** - Pastel activewear, wellness, soft gym vibes
2. **Coquette** - Lace, bows, pearls, romantic vintage mood  
3. **Clean Girl** - Minimalism, gold hoops, effortless style
4. **Dark Academia** - Tweed blazers, books, scholarly vibes
5. **Y2K** - Bold colors, rhinestones, early 2000s energy

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini Vision API
- **Search**: Google Custom Search API
- **Deployment**: Vercel-ready

## 📝 Development

- **Code Style**: ESLint + Prettier configured
- **Type Safety**: Full TypeScript coverage
- **File Structure**: Industry-standard Next.js App Router
- **Component Architecture**: Clean, reusable React components

## 🚢 Deployment

This project is configured for easy deployment on Vercel:

```bash
npm run build
```

Set your environment variables in your deployment platform.

## 📄 License

MIT License - see LICENSE file for details.  
