import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4">
      <div className="flex flex-col space-y-2">
        <Button variant="ghost" className="w-full text-left justify-start">
          Announcements
        </Button>
        <Button variant="ghost" className="w-full text-left justify-start">
          Community Posts
        </Button>
        {user && (
          <Button variant="ghost" className="w-full text-left justify-start">
            Submit Post
          </Button>
        )}
        <Button variant="ghost" className="w-full text-left justify-start">
          Events
        </Button>
        <Button variant="ghost" className="w-full text-left justify-start">
          Resources
        </Button>
      </div>
    </div>
  );
};