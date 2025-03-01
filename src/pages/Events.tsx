
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { AddEventDialog } from "@/components/events/AddEventDialog";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

const Events = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query for all events
  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          profiles (
            email
          )
        `)
        .order("start_time", { ascending: true });
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

  // Mutation for adding a new event
  const addEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("events")
        .insert([{
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          author_id: user?.id
        }]);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsAddEventOpen(false);
      resetForm();
      toast({ title: "Success", description: "Event added successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add event",
      });
    },
  });

  // Mutation for updating an event
  const updateEvent = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("events")
        .update({
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          updated_at: new Date().toISOString()
        })
        .eq("id", selectedEvent.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-events"] });
      queryClient.invalidateQueries({ queryKey: ["past-events"] });
      setIsAddEventOpen(false);
      resetForm();
      toast({ title: "Success", description: "Event updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update event",
      });
    },
  });

  // Mutation for deleting an event
  const deleteEvent = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming-events"] });
      queryClient.invalidateQueries({ queryKey: ["past-events"] });
      toast({ title: "Success", description: "Event deleted successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete event",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartTime("");
    setEndTime("");
    setSelectedEvent(null);
    setIsEditMode(false);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsAddEventOpen(true);
  };

  const handleOpenEditDialog = (event: any) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description || "");
    setLocation(event.location || "");
    setStartTime(format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"));
    setEndTime(format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"));
    setIsEditMode(true);
    setIsAddEventOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEvent.mutate(eventId);
    }
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateEvent.mutate();
    } else {
      addEvent.mutate();
    }
  };

  const handleAuthClick = async () => {
    if (user) {
      await signOut();
    }
  };

  const isNarrow = settings?.narrow_layout || false;

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

  const eventCardContent = (event: any) => (
    <>
      <CardHeader>
        <CardTitle className="text-xl">{event.title}</CardTitle>
        {event.description && (
          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Start:</strong> {formatEventDate(event.start_time)}
          </div>
          <div className="text-sm">
            <strong>End:</strong> {formatEventDate(event.end_time)}
          </div>
          {event.location && (
            <div className="text-sm">
              <strong>Location:</strong> {event.location}
            </div>
          )}
          {event.profiles?.email && (
            <p className="text-sm text-gray-500 mt-2">
              Added by: {event.profiles.email}
            </p>
          )}
        </div>
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
          <h1 className="text-3xl font-serif font-bold">Community Events</h1>
          {user && (
            <AddEventDialog
              isOpen={isAddEventOpen}
              onOpenChange={setIsAddEventOpen}
              title={title}
              description={description}
              location={location}
              startTime={startTime}
              endTime={endTime}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
              onLocationChange={setLocation}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
              onSubmit={handleSubmit}
              isPending={isEditMode ? updateEvent.isPending : addEvent.isPending}
              isEditMode={isEditMode}
            />
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading events...
          </div>
        ) : !events || events.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No events available at this time.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="h-full hover:shadow-lg transition-shadow relative">
                {user && (
                  <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(event)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                <div className="block h-full">
                  {eventCardContent(event)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Events;
