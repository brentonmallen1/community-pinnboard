import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: posts } = useQuery({
    queryKey: ["approved-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={handleAuthClick}
      />
      <MobileMenu isOpen={isMobileMenuOpen} />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold">Latest Posts</h2>
                {posts && posts.length > 0 && (
                  <Button variant="ghost" onClick={() => navigate("/posts")}>
                    View All Posts
                  </Button>
                )}
              </div>

              {posts?.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm text-gray-500">
                      By {post.profiles.email} • {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                </Card>
              ))}

              {(!posts || posts.length === 0) && (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No posts available at this time.
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
  );
};

export default Index;