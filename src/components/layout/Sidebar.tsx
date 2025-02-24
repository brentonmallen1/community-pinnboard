
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ManageQuickLinks } from "@/components/sidebar/ManageQuickLinks";
import { ManageUpcomingEvents } from "@/components/sidebar/ManageUpcomingEvents";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";
  const today = new Date();

  const { data: quickLinks } = useQuery({
    queryKey: ["quickLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("is_quick_link", true)
        .order("order_index", { ascending: true });
      if (error) {
        console.error("Error fetching quick links:", error);
        throw error;
      }
      return data;
    },
  });

  const { data: upcomingEvents, isLoading: isLoadingUpcomingEvents } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("start_time", today.toISOString())
        .order("start_time", { ascending: true })
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
        .lt("end_time", today.toISOString())
        .order("end_time", { ascending: false })
        .limit(2);

      if (error) throw error;
      return data;
    },
  });

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
    <aside className="md:col-span-4">
      {isModeratorOrAdmin ? (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <ManageUpcomingEvents />
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <ManageQuickLinks />
          </div>
        </div>
      ) : (
        <>
          {/* Events Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-6">Events</h2>
              
              {/* Upcoming Events */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
                {isLoadingUpcomingEvents ? (
                  <div className="text-center py-4">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    Loading upcoming events...
                  </div>
                ) : !upcomingEvents || upcomingEvents.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No upcoming events scheduled.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="block">Starts: {formatEventDate(event.start_time)}</span>
                          <span className="block">Ends: {formatEventDate(event.end_time)}</span>
                        </p>
                      </div>
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
                  <div className="text-center text-gray-500">
                    No past events to show.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastEvents.map((event) => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <h4 className="font-medium">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Was held from {formatEventDate(event.start_time)} to {formatEventDate(event.end_time)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {user && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => navigate("/submit-post")}
                  >
                    Submit a Post
                  </Button>
                )}
                {quickLinks?.map((link) => (
                  <Button
                    key={link.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => window.open(link.url, "_blank", "noopener,noreferrer")}
                  >
                    {link.title}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/helpful-links")}
                >
                  View All Links
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
};
