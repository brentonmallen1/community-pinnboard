
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ManageQuickLinks } from "@/components/sidebar/ManageQuickLinks";
import { ManageUpcomingEvents } from "@/components/sidebar/ManageUpcomingEvents";
import { useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

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

  const { data: upcomingEvents } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("upcoming_events")
        .select("*")
        .order("start_date", { ascending: true })
        .gte("end_date", today.toISOString())
        .limit(5);

      if (error) {
        console.error("Error fetching upcoming events:", error);
        throw error;
      }
      return data;
    },
  });

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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-serif font-bold mb-4">Upcoming Events</h3>
            {upcomingEvents?.length ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border-b pb-3 last:border-b-0">
                    <h4 className="font-medium">{event.title}</h4>
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.start_date).toLocaleDateString()} -{" "}
                      {new Date(event.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No upcoming events at this time.</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6 mt-6">
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
        </>
      )}
    </aside>
  );
};
