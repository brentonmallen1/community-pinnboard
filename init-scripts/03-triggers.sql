
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

-- Trigger for post notification emails
CREATE TRIGGER queue_post_notifications
  AFTER INSERT OR UPDATE OF status ON public.community_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_post_notifications();

-- Trigger for announcement notification emails
CREATE TRIGGER queue_announcement_notifications
  AFTER INSERT ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION handle_announcement_notifications();

-- Trigger for event notification emails
CREATE TRIGGER queue_event_notifications
  AFTER INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION handle_event_notifications();
