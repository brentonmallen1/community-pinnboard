import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SubmitPostForm } from "@/components/posts/SubmitPostForm";
import { PendingPosts } from "@/components/posts/PendingPosts";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  if (!user) {
    window.location.href = "/auth";
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
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-serif font-bold mb-4">Submit a Post</h2>
            <SubmitPostForm />
          </div>

          {isModeratorOrAdmin && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-serif font-bold mb-4">Pending Posts</h2>
              <PendingPosts />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;