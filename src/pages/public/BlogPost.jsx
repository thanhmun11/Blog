import { useParams } from "react-router-dom";
import { getPostById } from "../../services/postService";
import { useEffect, useState } from "react";

export default function BlogPost() {
  const { id } = useParams();
  // console.log(useParams());
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (!post) return <p className="text-center text-red-600">Post not found</p>;
  return (
    <div className="custom-container py-8">
      <h1 className="text-3xl font-bold text-primary mb-4">{post.title}</h1>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="text-sm text-gray-500 mb-4">
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <div>{post.content}</div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-primary">Comments</h2>
        <p className="text-gray-600">Comment section coming soon!</p>
      </div>
    </div>
  );
}
