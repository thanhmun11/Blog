<<<<<<< HEAD
import React, { useState } from "react";

// Mock dữ liệu bài viết và bình luận
const initialPosts = [
  {
    id: 1,
    title: "Bài viết 1",
    content: "Nội dung bài viết 1",
    status: "Nháp",
    comments: [
      { id: 1, author: "editor", text: "Bình luận 1" },
      { id: 2, author: "editor", text: "Bình luận 2" },
    ],
  },
  {
    id: 2,
    title: "Bài viết 2",
    content: "Nội dung bài viết 2",
    status: "Chờ duyệt",
    comments: [],
  },
];

const EditorPosts = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [formMode, setFormMode] = useState("create"); // "create" hoặc "edit"
  const [commentInputs, setCommentInputs] = useState({});

  // Xử lý mở form tạo/sửa
  const handleOpenForm = (mode, post = null) => {
    setFormMode(mode);
    setEditPost(post);
    setForm(post ? { title: post.title, content: post.content } : { title: "", content: "" });
    setShowForm(true);
  };

  // Xử lý lưu nháp hoặc gửi duyệt
  const handleSubmit = (status) => {
    if (formMode === "create") {
      const newPost = {
        id: Date.now(),
        title: form.title,
        content: form.content,
        status,
        comments: [],
      };
      setPosts([newPost, ...posts]);
    } else if (formMode === "edit" && editPost) {
      setPosts(posts.map((p) =>
        p.id === editPost.id ? { ...p, title: form.title, content: form.content, status } : p
      ));
    }
    setShowForm(false);
    setForm({ title: "", content: "" });
    setEditPost(null);
  };

  // Xử lý xóa bài viết
  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Xử lý gửi duyệt bài viết
  const handleSubmitForReview = (id) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, status: "Chờ duyệt" } : p)));
  };

  // Xử lý bình luận
  const handleAddComment = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts.map((p) =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Date.now(), author: "editor", text }] }
        : p
    ));
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  // Xử lý xóa bình luận
  const handleDeleteComment = (postId, commentId) => {
    setPosts(posts.map((p) =>
      p.id === postId
        ? { ...p, comments: p.comments.filter((c) => c.id !== commentId) }
        : p
    ));
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Bài viết của tôi</h2>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => handleOpenForm("create")}
      >
        Tạo bài viết
      </button>

      {/* Form tạo/sửa bài viết */}
      {showForm && (
        <div className="border p-4 mb-6 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-2">
            {formMode === "create" ? "Tạo bài viết mới" : "Sửa bài viết"}
          </h3>
          <input
            className="border p-2 w-full mb-2"
            type="text"
            placeholder="Tiêu đề"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="border p-2 w-full mb-2 min-h-[80px]"
            placeholder="Nội dung"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
          />
          <div className="flex gap-2">
            <button
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={() => handleSubmit("Nháp")}
            >
              Lưu nháp
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleSubmit("Chờ duyệt")}
            >
              Gửi duyệt
            </button>
            <button
              className="bg-red-400 text-white px-4 py-2 rounded ml-auto"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách bài viết */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-semibold text-lg">{post.title}</h4>
                <span className="text-sm text-gray-500">Trạng thái: {post.status}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => handleOpenForm("edit", post)}
                >
                  Sửa
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleDelete(post.id)}
                >
                  Xóa
                </button>
                {post.status === "Nháp" && (
                  <button
                    className="text-green-600"
                    onClick={() => handleSubmitForReview(post.id)}
                  >
                    Gửi duyệt
                  </button>
                )}
              </div>
            </div>
            <div className="mb-2 text-gray-700">{post.content}</div>
            {/* Bình luận */}
            {post.status === "Đã duyệt" || post.status === "Published" ? (
              <div className="mt-2">
                <h5 className="font-semibold mb-1">Bình luận</h5>
                <div className="space-y-1 mb-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-center gap-2">
                      <span className="text-sm">{c.text}</span>
                      <button
                        className="text-xs text-red-500"
                        onClick={() => handleDeleteComment(post.id, c.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    className="border p-1 flex-1"
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentInputs[post.id] || ""}
                    onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={e => { if (e.key === "Enter") handleAddComment(post.id); }}
                  />
                  <button
                    className="bg-blue-400 text-white px-2 rounded"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Gửi
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-gray-400 italic text-sm">
                Bình luận chỉ mở khi bài viết đã được duyệt.
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && <div>Chưa có bài viết nào.</div>}
      </div>
    </div>
  );
};

export default EditorPosts;
=======
export default function EditorPosts() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Editor Posts</h1>
      <p>Welcome, Editor! Create and edit posts here.</p>
    </div>
  );
}
>>>>>>> db0fb3b675d7a938a732f073d3ba98569a8501ad
