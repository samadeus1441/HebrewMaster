-- Hebrew Master: Initial Schema Migration
-- Semitic Morphology Engine
-- Created: 2024

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE
-- Extends auth.users with premium features and gamification
-- ============================================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    is_premium BOOLEAN DEFAULT false NOT NULL,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, is_premium, current_streak, total_xp)
    VALUES (
        NEW.id,
        false,
        0,
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 2. ROOTS TABLE
-- Core abstract unit of Semitic morphology
-- ============================================================================
CREATE TABLE public.roots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    root_letters VARCHAR(10) NOT NULL,
    core_meaning_en VARCHAR(255),
    core_meaning_fr VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_root_letters UNIQUE (root_letters)
);

-- Index for faster root lookups
CREATE INDEX idx_roots_letters ON public.roots(root_letters);

-- Enable RLS on roots (public read, admin write)
ALTER TABLE public.roots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roots are viewable by everyone"
    ON public.roots FOR SELECT
    USING (true);

-- ============================================================================
-- 3. VOCABULARY TABLE
-- The lexicon: Hebrew words with morphological data
-- ============================================================================
CREATE TABLE public.vocabulary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hebrew VARCHAR(255) NOT NULL,
    hebrew_unpointed VARCHAR(255) NOT NULL,
    transliteration VARCHAR(255),
    meaning_en VARCHAR(500),
    meaning_fr VARCHAR(500),
    part_of_speech VARCHAR(50),
    gender VARCHAR(20),
    root_id UUID REFERENCES public.roots(id) ON DELETE SET NULL,
    audio_url TEXT,
    difficulty_level INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_difficulty_level CHECK (difficulty_level >= 1 AND difficulty_level <= 10)
);

-- Indexes for vocabulary queries
CREATE INDEX idx_vocabulary_root_id ON public.vocabulary(root_id);
CREATE INDEX idx_vocabulary_hebrew_unpointed ON public.vocabulary(hebrew_unpointed);
CREATE INDEX idx_vocabulary_difficulty ON public.vocabulary(difficulty_level);
CREATE INDEX idx_vocabulary_part_of_speech ON public.vocabulary(part_of_speech);

-- Unique constraint: prevent duplicate vocabulary entries
CREATE UNIQUE INDEX idx_vocabulary_unique_entry ON public.vocabulary(
    hebrew_unpointed,
    meaning_en,
    part_of_speech
);

-- Enable RLS on vocabulary
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vocabulary is viewable by everyone"
    ON public.vocabulary FOR SELECT
    USING (true);

-- ============================================================================
-- 4. USER_PROGRESS TABLE
-- FSRS Algorithm State: Stores stability and difficulty for spaced repetition
-- ============================================================================
CREATE TABLE public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vocab_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE NOT NULL,
    stability FLOAT DEFAULT 0 NOT NULL,
    difficulty FLOAT DEFAULT 0 NOT NULL,
    next_review_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_review_date TIMESTAMPTZ,
    review_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_stability CHECK (stability >= 0),
    CONSTRAINT valid_difficulty CHECK (difficulty >= 0 AND difficulty <= 1),
    CONSTRAINT unique_user_vocab UNIQUE (user_id, vocab_id)
);

-- Indexes for efficient querying
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_vocab_id ON public.user_progress(vocab_id);
CREATE INDEX idx_user_progress_next_review ON public.user_progress(user_id, next_review_date);
CREATE INDEX idx_user_progress_due_reviews ON public.user_progress(next_review_date)
    WHERE next_review_date <= NOW();

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 5. UPDATED_AT TRIGGER FUNCTION
-- Automatically update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roots_updated_at
    BEFORE UPDATE ON public.roots
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vocabulary_updated_at
    BEFORE UPDATE ON public.vocabulary
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users with premium status and gamification metrics';
COMMENT ON TABLE public.roots IS 'Semitic roots: abstract morphological units (e.g., כתב = writing)';
COMMENT ON TABLE public.vocabulary IS 'Hebrew vocabulary lexicon with morphological annotations';
COMMENT ON TABLE public.user_progress IS 'FSRS algorithm state for spaced repetition scheduling';
COMMENT ON COLUMN public.user_progress.stability IS 'S (Stability) in FSRS: interval until next review';
COMMENT ON COLUMN public.user_progress.difficulty IS 'D (Difficulty) in FSRS: how hard the card is (0-1)';
COMMENT ON COLUMN public.user_progress.next_review_date IS 'Next scheduled review based on FSRS calculation';
