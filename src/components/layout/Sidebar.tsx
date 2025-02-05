import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="md:col-span-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-serif font-bold mb-4">Upcoming Events</h3>
        <p className="text-gray-600">No upcoming events at this time.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
        <div className="space-y-2">
          {user && (
            <Button variant="ghost" className="w-full justify-start">
              Submit a Post
            </Button>
          )}
          <Button variant="ghost" className="w-full justify-start">
            View Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Community Guidelines
          </Button>
        </div>
      </div>
    </aside>
  );
};