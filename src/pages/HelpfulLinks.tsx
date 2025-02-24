
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const HelpfulLinks = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuth();
  
  const { data: links, isLoading } = useQuery({
    queryKey: ["helpfulLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq('is_quick_link', false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={handleAuthClick}
      />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-6">Helpful Links</h1>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading links...
          </div>
        ) : !links || links.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No links available at this time.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <Card key={link.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{link.title}</CardTitle>
                  {link.description && (
                    <p className="text-sm text-gray-600 mt-2">{link.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Visit Link
                  </a>
                  {link.profiles?.email && (
                    <p className="text-sm text-gray-500 mt-2">
                      Added by: {link.profiles.email}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HelpfulLinks;
