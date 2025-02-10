
import { useState } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ManageQuickLinks = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quickLinks } = useQuery({
    queryKey: ["quickLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quick_links")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const createLink = useMutation({
    mutationFn: async () => {
      const maxOrder = quickLinks?.reduce((max, link) => Math.max(max, link.order_index), -1) ?? -1;
      const { error } = await supabase
        .from("quick_links")
        .insert([{ title, url, order_index: maxOrder + 1 }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      setIsAddOpen(false);
      setTitle("");
      setUrl("");
      toast({ title: "Success", description: "Quick link created successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create quick link",
      });
    },
  });

  const updateLink = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("quick_links")
        .update({ title, url })
        .eq("id", selectedLink.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      setIsEditOpen(false);
      setSelectedLink(null);
      setTitle("");
      setUrl("");
      toast({ title: "Success", description: "Quick link updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quick link",
      });
    },
  });

  const deleteLink = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("quick_links")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
      toast({ title: "Success", description: "Quick link deleted successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete quick link",
      });
    },
  });

  const moveLink = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: 'up' | 'down' }) => {
      if (!quickLinks) return;
      const currentIndex = quickLinks.findIndex(link => link.id === id);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= quickLinks.length) return;

      // Update current link's order
      const { error: error1 } = await supabase
        .from("quick_links")
        .update({ order_index: quickLinks[newIndex].order_index })
        .eq("id", quickLinks[currentIndex].id);
      if (error1) throw error1;

      // Update other link's order
      const { error: error2 } = await supabase
        .from("quick_links")
        .update({ order_index: quickLinks[currentIndex].order_index })
        .eq("id", quickLinks[newIndex].id);
      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quickLinks"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to move quick link",
      });
    },
  });

  const handleEditLink = (link: any) => {
    setSelectedLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif font-bold">Manage Quick Links</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Quick Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <Button 
                onClick={() => createLink.mutate()}
                disabled={!title || !url}
              >
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        {quickLinks?.map((link, index) => (
          <div key={link.id} className="flex items-center gap-2">
            <div className="flex-1">{link.title}</div>
            <div className="flex gap-1">
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveLink.mutate({ id: link.id, direction: 'up' })}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
              )}
              {index < (quickLinks.length - 1) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveLink.mutate({ id: link.id, direction: 'down' })}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditLink(link)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteLink.mutate(link.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Quick Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button 
              onClick={() => updateLink.mutate()}
              disabled={!title || !url}
            >
              Update Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
