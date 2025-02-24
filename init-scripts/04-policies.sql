
-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpful_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Community posts policies
CREATE POLICY "Anyone can view approved posts"
ON public.community_posts FOR SELECT
TO authenticated
USING (status = 'approved');

CREATE POLICY "Users can create posts"
ON public.community_posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own posts"
ON public.community_posts FOR UPDATE
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Quick links policies
CREATE POLICY "Quick links are viewable by everyone"
ON public.quick_links FOR SELECT
TO authenticated
USING (true);

-- Upcoming events policies
CREATE POLICY "Upcoming events are viewable by everyone"
ON public.upcoming_events FOR SELECT
TO authenticated
USING (true);
