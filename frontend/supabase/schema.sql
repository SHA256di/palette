-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create boards table
CREATE TABLE boards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    vibe TEXT NOT NULL,
    audience TEXT CHECK (audience IN ('gen_z', 'millennials', 'both')) NOT NULL,
    platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'linkedin', 'facebook')) NOT NULL,
    output_type TEXT CHECK (output_type IN ('campaign_mockup', 'shoot_ideas', 'set_brief')) NOT NULL,
    spotify_playlist_id TEXT,
    film_recommendations JSONB,
    moodboard_images JSONB,
    hashtags TEXT[],
    post_ideas TEXT[],
    ai_rationale TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX boards_user_id_idx ON boards(user_id);
CREATE INDEX boards_created_at_idx ON boards(created_at);
CREATE INDEX boards_vibe_idx ON boards USING gin(to_tsvector('english', vibe));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boards_updated_at 
    BEFORE UPDATE ON boards 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own boards" ON boards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own boards" ON boards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own boards" ON boards
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own boards" ON boards
    FOR DELETE USING (auth.uid() = user_id);