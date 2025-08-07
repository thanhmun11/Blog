import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/postService";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getPosts();
        // Lọc bài viết đã publish
        const publishedPosts = allPosts.filter(post => post.status === 'published');
        setPosts(publishedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả bài viết đã duyệt</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/editor/all/${post.id}`)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{post.title}</h3>
              <span className="px-2 py-1 rounded text-xs font-medium ml-2 bg-green-100 text-green-700">Đã duyệt</span>
            </div>
            <div className="text-sm text-gray-500">Tác giả: {post.author || "-"}</div>
            <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt || "-"}</div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-2 text-center text-gray-400">Chưa có bài viết nào đã duyệt.</div>}
      </div>
    </div>
  );
};

export default AllPosts; 