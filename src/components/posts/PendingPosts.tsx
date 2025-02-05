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

export function PendingPosts() {
  const { profile } = useAuth();
  const { toast } = useToast();

  const { data: pendingPosts, refetch } = useQuery({
    queryKey: ["pendingPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*, profiles(email)")
        .eq("status", "pending");

      if (error) throw error;
      return data;
    },
    enabled: profile?.role === "board_member" || profile?.role === "admin",
  });

  const handlePostStatus = async (postId: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("community_posts")
        .update({ status })
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: `Post ${status}`,
        description: `The post has been ${status}.`,
      });

      refetch();
    } catch (error) {
      console.error("Error updating post status:", error);
      toast({
        variant: "destructive",
        title: "Error updating post",
        description: "Please try again later.",
      });
    }
  };

  if (!pendingPosts?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No pending posts to review
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingPosts.map((post) => (
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
                onClick={() => handlePostStatus(post.id, "approved")}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handlePostStatus(post.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}