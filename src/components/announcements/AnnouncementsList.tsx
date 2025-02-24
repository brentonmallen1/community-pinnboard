
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: {
    email: string;
  };
}

interface AnnouncementsListProps {
  announcements: Announcement[] | null;
  isLoading: boolean;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementsList = ({
  announcements,
  isLoading,
  onEdit,
  onDelete,
}: AnnouncementsListProps) => {
  const { user, profile } = useAuth();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <span className="text-[#222222]">Loading announcements...</span>
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-[#222222]">
          No announcements available at this time.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <Card key={announcement.id}>
          <CardHeader>
            <CardTitle className="text-[#222222]">{announcement.title}</CardTitle>
            <p className="text-sm text-[#222222]">
              {new Date(announcement.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-[#222222]">{announcement.content}</p>
          </CardContent>
          {isModeratorOrAdmin && announcement.author_id === user?.id && (
            <CardFooter className="justify-end space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(announcement)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(announcement.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};
