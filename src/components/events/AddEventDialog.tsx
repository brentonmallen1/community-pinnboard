
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface AddEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onLocationChange: (location: string) => void;
  onStartTimeChange: (startTime: string) => void;
  onEndTimeChange: (endTime: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  isEditMode?: boolean;
}

export const AddEventDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  location,
  startTime,
  endTime,
  onTitleChange,
  onDescriptionChange,
  onLocationChange,
  onStartTimeChange,
  onEndTimeChange,
  onSubmit,
  isPending,
  isEditMode = false
}: AddEventDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Event Title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe this event"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="Event location"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit"
            disabled={!title || !startTime || !endTime || isPending}
            className="w-full"
          >
            {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Event" : "Add Event")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
