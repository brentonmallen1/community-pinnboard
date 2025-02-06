
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const BrowsePosts = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["posts", searchTerm],
    queryFn: async () => {
      console.log("Fetching posts with search term:", searchTerm);
      let query = supabase
        .from("community_posts")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq("status", "approved");

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No posts found");
        return [];
      }
      
      console.log("Fetched posts:", data);
      return data;
    },
    retry: 1,
  });

  const handleDelete = async (postId: string) => {
    if (!isModeratorOrAdmin) return;
    
    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      toast({
        title: "Post deleted successfully",
        description: "The post has been removed.",
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: "Please try again later.",
      });
    }
  };

  if (error) {
    console.error("Error in posts query:", error);
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <Header 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleAuthClick={signOut}
        />
        <MobileMenu isOpen={isMobileMenuOpen} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading posts. Please try again later.
            <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={signOut}
      />
      <MobileMenu isOpen={isMobileMenuOpen} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold">Community Posts</h1>
              {user && (
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                  Go to Dashboard to Submit or Manage Posts
                </Link>
              )}
            </div>
            <Input
              type="search"
              placeholder="Search posts..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              Loading posts...
            </div>
          ) : (
            <div className="grid gap-6">
              {!posts || posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found.</p>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <p className="text-sm text-gray-500">
                        By {post.profiles.email} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                      {isModeratorOrAdmin && (
                        <div className="flex gap-2">
                          <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                            Delete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowsePosts;
