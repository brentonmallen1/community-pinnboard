
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { PendingPosts } from "@/components/posts/PendingPosts";
import { ManageAnnouncements } from "@/components/announcements/ManageAnnouncements";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageApprovedPosts } from "@/components/posts/ManageApprovedPosts";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isModeratorOrAdmin) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthClick={signOut}
      />
      <MobileMenu isOpen={isMobileMenuOpen} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="announcements">Manage Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Pending Posts</h2>
              <PendingPosts />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Approved Posts</h2>
              <ManageApprovedPosts />
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Manage Announcements</h2>
              <ManageAnnouncements />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
