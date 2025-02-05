import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const BrowsePosts = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, profile, signOut } = useAuth();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  const { data: posts } = useQuery({
    queryKey: ["posts", searchTerm],
    queryFn: async () => {
      const query = supabase
        .from("community_posts")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq("status", "approved");

      if (searchTerm) {
        query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (postId: string) => {
    if (!isModeratorOrAdmin) return;
    
    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting post:", error);
    }
  };

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
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-serif font-bold">Community Posts</h1>
            <Input
              type="search"
              placeholder="Search posts..."
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-6">
            {posts?.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-gray-500">
                    By {post.profiles.email} • {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  {isModeratorOrAdmin && (
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={() => handleDelete(post.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowsePosts;