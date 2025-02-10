
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required").max(2000, "Content is too long"),
});

type PostFormData = z.infer<typeof postSchema>;

export function ManageApprovedPosts() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPost, setEditingPost] = useState<any>(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const { data: approvedPosts, refetch } = useQuery({
    queryKey: ["approvedPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*, profiles(email)")
        .eq("status", "approved");

      if (error) throw error;
      return data;
    },
    enabled: profile?.role === "board_member" || profile?.role === "admin",
  });

  const updatePost = useMutation({
    mutationFn: async (data: PostFormData) => {
      const { error } = await supabase
        .from("community_posts")
        .update({
          title: data.title,
          content: data.content,
        })
        .eq("id", editingPost.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvedPosts"] });
      setEditingPost(null);
      form.reset();
      toast({
        title: "Post updated",
        description: "The post has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: "Please try again later.",
      });
    },
  });

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "The post has been deleted successfully.",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: "Please try again later.",
      });
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    form.reset({
      title: post.title,
      content: post.content,
    });
  };

  const onSubmit = (data: PostFormData) => {
    updatePost.mutate(data);
  };

  if (!approvedPosts?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No approved posts to manage
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {approvedPosts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              By {post.profiles.email} • {new Date(post.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{post.content}</p>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => handleEdit(post)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingPost(null)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
