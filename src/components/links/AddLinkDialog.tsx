
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddLinkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  description: string;
  isQuickLink: boolean;
  onTitleChange: (title: string) => void;
  onUrlChange: (url: string) => void;
  onDescriptionChange: (description: string) => void;
  onIsQuickLinkChange: (isQuickLink: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
  isEditMode?: boolean;
}

export const AddLinkDialog = ({
  isOpen,
  onOpenChange,
  title,
  url,
  description,
  isQuickLink,
  onTitleChange,
  onUrlChange,
  onDescriptionChange,
  onIsQuickLinkChange,
  onSubmit,
  isPending,
  isEditMode = false
}: AddLinkDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Link" : "Add New Link"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Link Title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="https://example.com"
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Briefly describe this link"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Show in Quick Links?</Label>
            <RadioGroup 
              value={isQuickLink ? "yes" : "no"} 
              onValueChange={(value) => onIsQuickLinkChange(value === "yes")}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            type="submit"
            disabled={!title || !url || isPending}
            className="w-full"
          >
            {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Link" : "Add Link")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
