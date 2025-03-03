
-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

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

-- Links policies
CREATE POLICY "Links are viewable by everyone"
ON public.links FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can insert links"
ON public.links FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'board_member')
));

CREATE POLICY "Only admins can update links"
ON public.links FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'board_member')
))
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'board_member')
));

CREATE POLICY "Only admins can delete links"
ON public.links FOR DELETE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.role = 'admin' OR profiles.role = 'board_member')
));

-- Upcoming events policies
CREATE POLICY "Upcoming events are viewable by everyone"
ON public.upcoming_events FOR SELECT
TO authenticated
USING (true);

-- Email subscriptions policies
CREATE POLICY "Users can view their own email subscriptions"
ON public.email_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own email subscriptions"
ON public.email_subscriptions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email subscriptions"
ON public.email_subscriptions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Email templates policies
CREATE POLICY "Email templates are viewable by admins"
ON public.email_templates FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can manage email templates"
ON public.email_templates FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can update email templates"
ON public.email_templates FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));

-- Email queue policies
CREATE POLICY "Email queue is viewable by admins"
ON public.email_queue FOR SELECT
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can manage email queue"
ON public.email_queue FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));

CREATE POLICY "Only admins can update email queue"
ON public.email_queue FOR UPDATE
TO authenticated
USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
));
