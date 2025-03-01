
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { AddLinkDialog } from "@/components/links/AddLinkDialog";
import { useToast } from "@/hooks/use-toast";

const HelpfulLinks = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isQuickLink, setIsQuickLink] = useState(false);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query for all links
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
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Query for settings
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Mutation for adding a new link
  const addLink = useMutation({
    mutationFn: async () => {
      const maxOrder = links
        ?.filter(link => link.is_quick_link)
        .reduce((max, link) => Math.max(max, link.order_index || 0), -1) ?? -1;
      
      const { error } = await supabase
        .from("links")
        .insert([{
          title,
          url,
          description,
          is_quick_link: isQuickLink,
          order_index: isQuickLink ? maxOrder + 1 : null,
          author_id: user?.id
        }]);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["helpfulLinks"] });
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      setIsAddLinkOpen(false);
      resetForm();
      toast({ title: "Success", description: "Link added successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add link",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setIsQuickLink(false);
  };

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    }
  };

  const isNarrow = settings?.narrow_layout || false;

  return (
    <div className={`min-h-screen ${isNarrow ? 'bg-[#222222]' : 'bg-[#f3f3f3]'}`}>
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={handleAuthClick}
      />

      <main className={`container mx-auto px-4 py-8 ${isNarrow ? 'max-w-5xl bg-[#f3f3f3]' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Helpful Links</h1>
          {user && (
            <AddLinkDialog
              isOpen={isAddLinkOpen}
              onOpenChange={setIsAddLinkOpen}
              title={title}
              url={url}
              description={description}
              isQuickLink={isQuickLink}
              onTitleChange={setTitle}
              onUrlChange={setUrl}
              onDescriptionChange={setDescription}
              onIsQuickLinkChange={setIsQuickLink}
              onSubmit={() => addLink.mutate()}
              isPending={addLink.isPending}
            />
          )}
        </div>
        
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
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl">{link.title}</CardTitle>
                    {link.description && (
                      <p className="text-sm text-gray-600 mt-2">{link.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {link.profiles?.email && (
                      <p className="text-sm text-gray-500 mt-2">
                        Added by: {link.profiles.email}
                      </p>
                    )}
                    {link.is_quick_link && (
                      <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        Quick Link
                      </div>
                    )}
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HelpfulLinks;
