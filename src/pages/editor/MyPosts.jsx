import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/postService";
import { getCurrentUser } from "../../services/authService";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy bài viết từ API backend
  const fetchPosts = async () => {
    try {
      const currentUser = getCurrentUser();
      const allPosts = await getPosts();
      // Lọc bài viết của user hiện tại (mọi trạng thái)
      const myPosts = allPosts.filter(post => 
        post.author_id === currentUser?.id || post.author_id === currentUser?.userId
      );
      setPosts(myPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // Xóa bài viết (API)
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Gửi duyệt bài viết nháp (API)
  const handleSubmitForReview = async (post) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...post, status: "pending" }),
      });
      setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: "pending" } : p));
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bài viết của tôi</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/editor/create")}
        >
          + Tạo bài viết
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{post.title}</h3>
              <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${post.status === "draft" ? "bg-gray-200 text-gray-700" : post.status === "published" ? "bg-green-100 text-green-700" : post.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{post.status === "draft" ? "Nháp" : post.status === "published" ? "Đã duyệt" : post.status === "pending" ? "Chờ duyệt" : post.status}</span>
            </div>
            <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt || "-"}</div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm" onClick={() => navigate(`/editor/edit/${post.id}`)}>Sửa</button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" onClick={() => handleDelete(post.id)}>Xoá</button>
              {post.status === "draft" && (
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm" onClick={() => handleSubmitForReview(post)}>Gửi duyệt</button>
              )}
              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm" onClick={() => navigate(`/editor/my/${post.id}`)}>Xem chi tiết</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-2 text-center text-gray-400">Chưa có bài viết nào.</div>}
      </div>
    </div>
  );
};

export default MyPosts; 