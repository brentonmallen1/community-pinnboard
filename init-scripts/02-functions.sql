
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'member');
  RETURN new;
END;
$$;

-- Function to handle post status based on user role
CREATE OR REPLACE FUNCTION public.handle_post_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = NEW.author_id
        AND (profiles.role = 'admin' OR profiles.role = 'board_member')
    ) THEN
        NEW.status = 'approved'::post_status;
    END IF;
    RETURN NEW;
END;
$$;
