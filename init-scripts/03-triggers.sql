
-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Trigger for post status
CREATE TRIGGER set_post_status
  BEFORE INSERT ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_post_status();
