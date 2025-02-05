import { useAuth } from "@/contexts/AuthContext";
import { SubmitPostForm } from "@/components/posts/SubmitPostForm";
import { PendingPosts } from "@/components/posts/PendingPosts";

export const MainContent = () => {
  const { user, profile } = useAuth();
  const isModeratorOrAdmin = profile?.role === "board_member" || profile?.role === "admin";

  return (
    <div className="md:col-span-8">
      {user && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold mb-4">Submit a Post</h2>
          <SubmitPostForm />
        </div>
      )}

      {isModeratorOrAdmin && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-serif font-bold mb-4">Pending Posts</h2>
          <PendingPosts />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-serif font-bold mb-4">Latest Announcements</h2>
        <p className="text-gray-600">Welcome to our community bulletin board! Stay updated with the latest announcements, events, and community posts.</p>
      </div>
    </div>
  );
};