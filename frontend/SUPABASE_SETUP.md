# Supabase Setup Guide for Palette

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Database Setup

### Step 1: Run the SQL Schema
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the query to create the database schema

### Step 2: Configure Environment Variables
1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials from your project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your public anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (for server-side operations)

### Step 3: Enable Authentication (Optional)
If you want user authentication:
1. Go to Authentication > Settings in your Supabase dashboard
2. Enable your preferred providers (email, Google, etc.)
3. Configure the redirect URLs for your domain

## Database Schema Overview

### Tables Created:
- **users**: Store user profiles and email addresses
- **boards**: Store inspiration pack data including:
  - User preferences (vibe, audience, platform)
  - Generated content (playlists, films, images)
  - Metadata (hashtags, post ideas, AI rationale)

### Security:
- Row Level Security (RLS) is enabled
- Users can only access their own data
- Policies are configured for proper access control

## Testing the Connection

You can test your Supabase connection by importing the client in your components:

```typescript
import { supabase } from '@/lib/supabase'
import { createBoard, getBoardsByUserId } from '@/lib/database'

// Example usage
const board = await createBoard({
  user_id: 'user-id',
  title: 'My Inspiration Pack',
  vibe: 'indie sleaze',
  audience: 'gen_z',
  platform: 'instagram',
  output_type: 'campaign_mockup'
})
```

## Next Steps
1. Install dependencies: `npm install`
2. Set up your environment variables
3. Test the connection by creating a board
4. Integrate with the Spotify API for playlist generation