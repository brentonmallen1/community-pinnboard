
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: {
    email: string;
  };
}

interface PostsListProps {
  posts: Post[] | null;
  isLoading: boolean;
}

export const PostsList = ({ posts, isLoading }: PostsListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        Loading posts...
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No posts available at this time.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold">Latest Posts</h2>
        <Button variant="ghost" onClick={() => navigate("/posts")}>
          View All Posts
        </Button>
      </div>
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
