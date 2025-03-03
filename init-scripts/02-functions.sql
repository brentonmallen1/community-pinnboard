
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

-- Function to queue email notifications for new approved posts
CREATE OR REPLACE FUNCTION public.handle_post_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_subject TEXT;
    template_body TEXT;
    subscriber RECORD;
BEGIN
    -- Only send notifications for approved posts
    IF NEW.status != 'approved' THEN
        RETURN NEW;
    END IF;

    -- Get the post notification template
    SELECT subject_template, body_template 
    INTO template_subject, template_body
    FROM email_templates 
    WHERE template_name = 'post_notification'
    LIMIT 1;
    
    -- If no template, use defaults
    IF template_subject IS NULL THEN
        template_subject := 'New Post: {{title}}';
    END IF;
    
    IF template_body IS NULL THEN
        template_body := '<h1>New Post: {{title}}</h1><p>{{content}}</p>';
    END IF;
    
    -- Replace placeholders with actual content
    template_subject := REPLACE(template_subject, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{content}}', NEW.content);
    
    -- Send to all subscribers who want post notifications
    FOR subscriber IN 
        SELECT p.email 
        FROM profiles p
        JOIN email_subscriptions es ON p.id = es.user_id
        WHERE es.notify_on_posts = true
    LOOP
        INSERT INTO email_queue (recipient_email, subject, content)
        VALUES (subscriber.email, template_subject, template_body);
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- Function to queue email notifications for new announcements
CREATE OR REPLACE FUNCTION public.handle_announcement_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_subject TEXT;
    template_body TEXT;
    subscriber RECORD;
BEGIN
    -- Get the announcement notification template
    SELECT subject_template, body_template 
    INTO template_subject, template_body
    FROM email_templates 
    WHERE template_name = 'announcement_notification'
    LIMIT 1;
    
    -- If no template, use defaults
    IF template_subject IS NULL THEN
        template_subject := 'New Announcement: {{title}}';
    END IF;
    
    IF template_body IS NULL THEN
        template_body := '<h1>New Announcement: {{title}}</h1><p>{{content}}</p>';
    END IF;
    
    -- Replace placeholders with actual content
    template_subject := REPLACE(template_subject, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{content}}', NEW.content);
    
    -- Send to all subscribers who want announcement notifications
    FOR subscriber IN 
        SELECT p.email 
        FROM profiles p
        JOIN email_subscriptions es ON p.id = es.user_id
        WHERE es.notify_on_announcements = true
    LOOP
        INSERT INTO email_queue (recipient_email, subject, content)
        VALUES (subscriber.email, template_subject, template_body);
    END LOOP;
    
    RETURN NEW;
END;
$$;

-- Function to queue email notifications for new events
CREATE OR REPLACE FUNCTION public.handle_event_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    template_subject TEXT;
    template_body TEXT;
    subscriber RECORD;
    event_time TEXT;
BEGIN
    -- Get the event notification template
    SELECT subject_template, body_template 
    INTO template_subject, template_body
    FROM email_templates 
    WHERE template_name = 'event_notification'
    LIMIT 1;
    
    -- If no template, use defaults
    IF template_subject IS NULL THEN
        template_subject := 'New Event: {{title}}';
    END IF;
    
    IF template_body IS NULL THEN
        template_body := '<h1>New Event: {{title}}</h1><p>{{description}}</p><p>Location: {{location}}</p><p>Time: {{time}}</p>';
    END IF;
    
    -- Format event time
    event_time := to_char(NEW.start_time, 'Day, Mon DD, YYYY at HH:MI AM');
    
    -- Replace placeholders with actual content
    template_subject := REPLACE(template_subject, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{title}}', NEW.title);
    template_body := REPLACE(template_body, '{{description}}', COALESCE(NEW.description, 'No description provided'));
    template_body := REPLACE(template_body, '{{location}}', COALESCE(NEW.location, 'No location specified'));
    template_body := REPLACE(template_body, '{{time}}', event_time);
    
    -- Send to all subscribers who want event notifications
    FOR subscriber IN 
        SELECT p.email 
        FROM profiles p
        JOIN email_subscriptions es ON p.id = es.user_id
        WHERE es.notify_on_events = true
    LOOP
        INSERT INTO email_queue (recipient_email, subject, content)
        VALUES (subscriber.email, template_subject, template_body);
    END LOOP;
    
    RETURN NEW;
END;
$$;
