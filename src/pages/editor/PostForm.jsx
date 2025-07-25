import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:3000/posts";
const getCurrentUser = () => "editor";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`${API_URL}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title || "");
          setContent(data.content || "");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const savePost = async (status) => {
    setSaving(true);
    const post = {
      title,
      content,
      status,
      author: getCurrentUser(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    try {
      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...post, id }),
        });
      } else {
        const res = await fetch(`${API_URL}?author=${getCurrentUser()}&status=draft`);
        const drafts = await res.json();
        if (drafts.length > 0) {
          await fetch(`${API_URL}/${drafts[0].id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...drafts[0], ...post }),
          });
        } else {
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post),
          });
        }
      }
      navigate("/editor/myposts");
    } catch (e) {
      alert("Lưu bài viết thất bại!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="w-full">
      <form
        className="w-full bg-white shadow-sm border rounded-none p-8 flex flex-col gap-6"
        onSubmit={e => e.preventDefault()}
      >
        <div className="text-2xl font-bold mb-2">{id ? "Sửa bài viết" : "Tạo bài viết mới"}</div>
        <input
          className="border border-gray-300 rounded p-4 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
          type="text"
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={120}
          required
        />
        <textarea
          ref={textareaRef}
          className="border border-gray-300 rounded p-4 text-base min-h-[160px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
          placeholder="Nội dung bài viết..."
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <div className="flex flex-col sm:flex-row gap-3 justify-end mt-2">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded font-medium transition"
            disabled={saving}
            onClick={() => savePost("draft")}
          >
            Lưu nháp
          </button>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition"
            disabled={saving}
            onClick={() => savePost("pending")}
          >
            Gửi duyệt
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded font-medium transition"
            onClick={() => navigate("/editor/myposts")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm; 