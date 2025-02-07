
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function ManageApprovedPosts() {
  const { profile } = useAuth();
  const { toast } = useToast();

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
                variant="destructive"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
