
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const NavigationItems = () => {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

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
  );
};
