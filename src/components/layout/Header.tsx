
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
  handleAuthClick: () => void;
}

export const Header = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleAuthClick,
}: HeaderProps) => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

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

  const communityName = settings?.community_name || "Community Bulletin Board";
  const communitySubtitle = settings?.subtitle || "Your Source for Local Updates and Announcements";

  const navigationItems = useMemo(() => {
    const items = [
      {
        name: "Home",
        href: "/",
      },
      {
        name: "Posts",
        href: "/posts",
      },
      {
        name: "Events",
        href: "/events",
      },
      {
        name: "Helpful Links",
        href: "/links",
      },
    ];

    if (user) {
      items.push({
        name: "Submit Post",
        href: "/submit",
      });
    }

    if (isModeratorOrAdmin) {
      items.push({
        name: "Dashboard",
        href: "/dashboard",
      });
    }

    if (isAdmin) {
      items.push({
        name: "Settings",
        href: "/admin/settings",
      });
    }

    return items;
  }, [user, isModeratorOrAdmin, isAdmin]);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex flex-col">
              <h1 className="text-xl font-serif font-bold text-[#222222]">
                {communityName}
              </h1>
              <p className="text-xs text-gray-500">{communitySubtitle}</p>
            </Link>
          </div>

          <div className="md:flex items-center gap-4 hidden">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      {navigationItems.map((item) => (
                        <li key={item.name}>
                          <Link
                            to={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.name}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span className="sr-only">Log out</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAuthClick}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleAuthClick} variant="ghost">
                Sign In
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
