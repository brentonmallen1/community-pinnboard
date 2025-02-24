import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  handleAuthClick: () => void;
}

export const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, handleAuthClick }: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  const { data: pendingPostsCount } = useQuery({
    queryKey: ["pendingPostsCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("community_posts")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending");

      if (error) throw error;
      return count || 0;
    },
    enabled: isModeratorOrAdmin,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const resourcesMenuItems = [
    {
      label: "Helpful Links",
      href: "/helpful-links",
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="py-6 text-center">
          <Link to="/" className="hover:opacity-80">
            <h1 className="text-4xl font-serif font-bold text-gray-900">Community Bulletin Board</h1>
            <p className="mt-2 text-gray-600">Your Source for Local Updates and Announcements</p>
          </Link>
        </div>
        
        <nav className="py-4">
          <div className="flex justify-between items-center md:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <Home className="h-6 w-6" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={user ? handleSignOut : () => navigate("/auth")}
            >
              {user ? <LogOut className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
            </Button>
          </div>
          
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="mr-2"
              >
                <Home className="h-5 w-5" />
              </Button>
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="relative">
                      Posts
                      {isModeratorOrAdmin && pendingPostsCount && pendingPostsCount > 0 && (
                        <Badge variant="destructive" className="absolute -right-2 -top-2 min-w-[20px] h-5">
                          {pendingPostsCount}
                        </Badge>
                      )}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[200px]">
                      <div className="grid gap-1 p-2">
                        <NavigationMenuLink asChild>
                          <Link to="/posts" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            Browse Posts
                          </Link>
                        </NavigationMenuLink>
                        {user && (
                          <NavigationMenuLink asChild>
                            <Link to="/submit-post" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              Submit Post
                            </Link>
                          </NavigationMenuLink>
                        )}
                        {isModeratorOrAdmin && (
                          <NavigationMenuLink asChild>
                            <Link to="/dashboard" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              Manage Posts {pendingPostsCount && pendingPostsCount > 0 && `(${pendingPostsCount})`}
                            </Link>
                          </NavigationMenuLink>
                        )}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[200px]">
                      <div className="grid gap-1 p-2">
                        {resourcesMenuItems.map((item, index) => (
                          <NavigationMenuLink asChild key={index}>
                            <Link to={item.href} className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              {item.label}
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {profile?.role === "admin" && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link to="/admin/settings" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Settings
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <Button
              variant="ghost"
              onClick={user ? handleSignOut : () => navigate("/auth")}
              className="ml-4"
            >
              {user ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
