import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/posts";
const getCurrentUser = () => "editor"; // Giả lập lấy user hiện tại

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy bài viết từ db.json (API)
  const fetchPosts = () => {
    fetch(`${API_URL}?author=${getCurrentUser()}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line
  }, []);

  // Xóa bài viết (API)
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  // Gửi duyệt bài viết nháp (API)
  const handleSubmitForReview = async (post) => {
    await fetch(`${API_URL}/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: "pending" }),
    });
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, status: "pending" } : p));
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
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm" onClick={() => handleDelete(post.id)}>Xóa</button>
              {post.status === "draft" && (
                <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm" onClick={() => handleSubmitForReview(post)}>Gửi duyệt</button>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-2 text-center text-gray-400">Chưa có bài viết nào.</div>}
      </div>
    </div>
  );
};

export default MyPosts; 