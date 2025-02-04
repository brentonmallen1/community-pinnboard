import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="py-6 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900">Community Bulletin Board</h1>
            <p className="mt-2 text-gray-600">Your Source for Local Updates and Announcements</p>
          </div>
          
          {/* Navigation */}
          <nav className="py-4">
            <div className="flex justify-between items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            <NavigationMenu className="hidden md:flex justify-center">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Announcements</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[200px]">
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Latest News
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Important Updates
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Community Posts</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[200px]">
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Browse Posts
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Submit Post
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[200px]">
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Calendar
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Upcoming Events
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-4 w-[200px]">
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Helpful Links
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block py-2 hover:bg-gray-100 rounded px-3">
                        Contact
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden mt-4">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="w-full text-left justify-start">
                    Announcements
                  </Button>
                  <Button variant="ghost" className="w-full text-left justify-start">
                    Community Posts
                  </Button>
                  <Button variant="ghost" className="w-full text-left justify-start">
                    Events
                  </Button>
                  <Button variant="ghost" className="w-full text-left justify-start">
                    Resources
                  </Button>
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="md:col-span-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Latest Announcements</h2>
              <p className="text-gray-600">Welcome to our community bulletin board! Stay updated with the latest announcements, events, and community posts.</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-serif font-bold mb-4">Upcoming Events</h3>
              <p className="text-gray-600">No upcoming events at this time.</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Submit a Post
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  View Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Community Guidelines
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Index;