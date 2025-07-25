import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/posts";

const ManagerDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bài viết chờ duyệt
  const fetchPendingPosts = () => {
    fetch(`${API_URL}?status=pending`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  // Duyệt bài viết
  const handleApprove = async (post) => {
    await fetch(`${API_URL}/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: "published" }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  // Từ chối bài viết
  const handleReject = async (post) => {
    await fetch(`${API_URL}/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...post, status: "draft" }),
    });
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Quản lý bài viết chờ duyệt</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded shadow p-4 flex flex-col gap-2 border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{post.title}</h3>
                <div className="text-sm text-gray-500">Tác giả: {post.author || "-"}</div>
                <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt || "-"}</div>
              </div>
              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">Chờ duyệt</span>
            </div>
            <div className="text-gray-700 mb-2">{post.content}</div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleApprove(post)}>Duyệt</button>
              <button className="bg-red-400 text-white px-4 py-1 rounded" onClick={() => handleReject(post)}>Từ chối</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="text-center text-gray-400">Không có bài viết nào chờ duyệt.</div>}
      </div>
    </div>
  );
};

export default ManagerDashboard;
