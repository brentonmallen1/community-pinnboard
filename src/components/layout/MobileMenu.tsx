
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
}

export const MobileMenu = ({ isOpen }: MobileMenuProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";
  const isAdmin = profile?.role === "admin";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4">
      <div className="flex flex-col space-y-2">
        <Link to="/">
          <Button variant="ghost" className="w-full text-left justify-start">
            <Home className="h-4 w-4 mr-2" />
            Home
          </Button>
        </Link>

        <Link to="/posts">
          <Button variant="ghost" className="w-full text-left justify-start">
            Browse Posts
          </Button>
        </Link>
        
        {user && (
          <Link to="/submit-post">
            <Button variant="ghost" className="w-full text-left justify-start">
              Submit Post
            </Button>
          </Link>
        )}

        {isModeratorOrAdmin && (
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full text-left justify-start">
              Manage Posts
            </Button>
          </Link>
        )}

        <Button variant="ghost" className="w-full text-left justify-start">
          Events
        </Button>

        <Button variant="ghost" className="w-full text-left justify-start">
          Resources
        </Button>

        {isAdmin && (
          <Link to="/admin/settings">
            <Button variant="ghost" className="w-full text-left justify-start">
              Settings
            </Button>
          </Link>
        )}

        {user && (
          <Button 
            variant="ghost" 
            className="w-full text-left justify-start text-red-600 hover:text-red-700"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};
