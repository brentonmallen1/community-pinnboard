import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AnnouncementsList } from "@/components/announcements/AnnouncementsList";
import { CreateAnnouncementDialog } from "@/components/announcements/CreateAnnouncementDialog";
import { PostsList } from "@/components/posts/PostsList";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

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

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
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

  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
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

  const createAnnouncement = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("announcements")
        .insert([{ title, content, author_id: user?.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsAddAnnouncementOpen(false);
      setTitle("");
      setContent("");
      toast({
        title: "Success",
        description: "Announcement created successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create announcement",
      });
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete announcement",
      });
    },
  });

  const isNarrow = settings?.narrow_layout || false;

  return (
    <div className={`min-h-screen ${isNarrow ? 'bg-[#222222]' : 'bg-[#f3f3f3]'}`}>
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={signOut}
      />
      <MobileMenu isOpen={isMobileMenuOpen} />

      <main className="min-h-[calc(100vh-4rem)] mx-auto flex flex-col">
        <div className={`flex-1 ${isNarrow ? 'max-w-5xl mx-auto bg-[#f3f3f3]' : 'container'}`}>
          <div className={`h-full ${isNarrow ? 'px-4' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-8">
              <div className="md:col-span-8">
                <div className="space-y-6">
                  {/* Announcements Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-serif font-bold text-[#222222]">Announcements</h2>
                      {isModeratorOrAdmin && (
                        <CreateAnnouncementDialog
                          isOpen={isAddAnnouncementOpen}
                          onOpenChange={setIsAddAnnouncementOpen}
                          title={title}
                          content={content}
                          onTitleChange={setTitle}
                          onContentChange={setContent}
                          onSubmit={() => createAnnouncement.mutate()}
                        />
                      )}
                    </div>
                    <AnnouncementsList
                      announcements={announcements}
                      isLoading={isLoadingAnnouncements}
                      onEdit={() => {}}
                      onDelete={(id) => deleteAnnouncement.mutate(id)}
                    />
                  </div>

                  {/* Posts Section */}
                  <PostsList posts={posts} isLoading={isLoadingPosts} />
                </div>
              </div>
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
