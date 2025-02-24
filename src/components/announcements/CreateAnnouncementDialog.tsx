
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface CreateAnnouncementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
}

export const CreateAnnouncementDialog = ({
  isOpen,
  onOpenChange,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSubmit,
}: CreateAnnouncementDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={onSubmit}
            disabled={!title || !content}
          >
            Create Announcement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
