import { useState, useEffect } from "react";
import PostCard from "../../components/viewer/PostCard";
import { getPosts } from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);
  const { user } = useAuth();
  user ? console.log(user.username) : console.log("Chưa đăng nhập đâu!");

  return (
    <div className="custom-container py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">Latest Posts</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
