import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash, Plus } from "lucide-react";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [isEditAnnouncementOpen, setIsEditAnnouncementOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";
  const today = new Date();

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

  const { data: upcomingEvents, isLoading: isLoadingUpcomingEvents } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("start_date", today.toISOString())
        .order("start_date", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  const { data: pastEvents, isLoading: isLoadingPastEvents } = useQuery({
    queryKey: ["past-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .lt("end_date", today.toISOString())
        .order("end_date", { ascending: false })
        .limit(2);

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

  const updateAnnouncement = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("announcements")
        .update({ title, content })
        .eq("id", selectedAnnouncement.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      setIsEditAnnouncementOpen(false);
      setSelectedAnnouncement(null);
      setTitle("");
      setContent("");
      toast({
        title: "Success",
        description: "Announcement updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update announcement",
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

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    } else {
      navigate("/auth");
    }
  };

  const handleEditAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setTitle(announcement.title);
    setContent(announcement.content);
    setIsEditAnnouncementOpen(true);
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              {/* Announcements Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-serif font-bold">Announcements</h2>
                  {isModeratorOrAdmin && (
                    <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          New Announcement
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Announcement</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                          <Textarea
                            placeholder="Content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <Button 
                            onClick={() => createAnnouncement.mutate()}
                            disabled={!title || !content}
                          >
                            Create Announcement
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {isLoadingAnnouncements ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading announcements...
                  </div>
                ) : !announcements || announcements.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      No announcements available at this time.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id}>
                        <CardHeader>
                          <CardTitle>{announcement.title}</CardTitle>
                          <p className="text-sm text-gray-500">
                            By {announcement.profiles.email} • {new Date(announcement.created_at).toLocaleDateString()}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <p>{announcement.content}</p>
                        </CardContent>
                        {isModeratorOrAdmin && announcement.author_id === user?.id && (
                          <CardFooter className="justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditAnnouncement(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => deleteAnnouncement.mutate(announcement.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {/* Edit Announcement Dialog */}
                <Dialog open={isEditAnnouncementOpen} onOpenChange={setIsEditAnnouncementOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Announcement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button 
                        onClick={() => updateAnnouncement.mutate()}
                        disabled={!title || !content}
                      >
                        Update Announcement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Events Section */}
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Events</h2>
                
                {/* Upcoming Events */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
                  {isLoadingUpcomingEvents ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      Loading upcoming events...
                    </div>
                  ) : !upcomingEvents || upcomingEvents.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        No upcoming events scheduled.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <Card key={event.id}>
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {event.description && (
                              <p className="text-gray-600 mb-3">{event.description}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              Starts: {formatEventDate(event.start_date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Ends: {formatEventDate(event.end_date)}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Events */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Past Events</h3>
                  {isLoadingPastEvents ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      Loading past events...
                    </div>
                  ) : !pastEvents || pastEvents.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        No past events to show.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {pastEvents.map((event) => (
                        <Card key={event.id} className="bg-gray-50">
                          <CardHeader>
                            <CardTitle>{event.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {event.description && (
                              <p className="text-gray-600 mb-3">{event.description}</p>
                            )}
                            <p className="text-sm text-gray-500">
                              Was held from {formatEventDate(event.start_date)} to {formatEventDate(event.end_date)}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Posts Section */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold">Latest Posts</h2>
                {posts && posts.length > 0 && (
                  <Button variant="ghost" onClick={() => navigate("/posts")}>
                    View All Posts
                  </Button>
                )}
              </div>

              {isLoadingPosts ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  Loading posts...
                </div>
              ) : !posts || posts.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-gray-500">
                    No posts available at this time.
                  </CardContent>
                </Card>
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
                      <p>{post.content}</p>
                    </CardContent>
                  </Card>
                ))
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
