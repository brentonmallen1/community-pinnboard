import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface PostFormData {
  title: string;
  content: string;
}

export function SubmitPostForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<PostFormData>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("community_posts").insert({
        title: data.title,
        content: data.content,
        author_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Post submitted successfully",
        description: "Your post will be reviewed by a board member.",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        variant: "destructive",
        title: "Error submitting post",
        description: "Please try again later.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your post content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Post</Button>
      </form>
    </Form>
  );
}