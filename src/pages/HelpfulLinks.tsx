
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { AddLinkDialog } from "@/components/links/AddLinkDialog";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const HelpfulLinks = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
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

  // Mutation for updating a link
  const updateLink = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("links")
        .update({
          title,
          url,
          description,
          is_quick_link: isQuickLink,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedLink.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["helpfulLinks"] });
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      setIsAddLinkOpen(false);
      resetForm();
      toast({ title: "Success", description: "Link updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update link",
      });
    },
  });

  // Mutation for deleting a link
  const deleteLink = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["helpfulLinks"] });
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      toast({ title: "Success", description: "Link deleted successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete link",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setIsQuickLink(false);
    setSelectedLink(null);
    setIsEditMode(false);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddLinkOpen(true);
  };

  const handleOpenEditDialog = (link: any) => {
    setSelectedLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setDescription(link.description || "");
    setIsQuickLink(link.is_quick_link || false);
    setIsEditMode(true);
    setIsAddLinkOpen(true);
  };

  const handleDeleteLink = (linkId: string) => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      deleteLink.mutate(linkId);
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateLink.mutate();
    } else {
      addLink.mutate();
    }
  };

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    }
  };

  const isNarrow = settings?.narrow_layout || false;

  const linkCardContent = (link: any) => (
    <>
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
    </>
  );

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
              onSubmit={handleSubmit}
              isPending={isEditMode ? updateLink.isPending : addLink.isPending}
              isEditMode={isEditMode}
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
              <Card key={link.id} className="h-full hover:shadow-lg transition-shadow relative">
                {user && (
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(link)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                  onClick={(e) => user && e.currentTarget !== e.target && e.preventDefault()}
                >
                  {linkCardContent(link)}
                </a>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HelpfulLinks;
