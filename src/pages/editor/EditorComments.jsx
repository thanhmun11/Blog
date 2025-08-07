import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const EditorComments = () => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Lấy tất cả bình luận của các bài viết do user hiện tại tạo ra
        const res = await axios.get("/api/posts/editor/comments", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setComments(res.data);
      } catch (err) {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchComments();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
          <ChatBubbleBottomCenterTextIcon className="h-7 w-7 text-indigo-500" />
          Quản lý bình luận bài viết của bạn
        </h1>
        {loading ? (
          <div>Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div>Không có bình luận nào cho các bài viết của bạn.</div>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-indigo-700">{c.author_name}</span>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div className="text-gray-800 mb-2">{c.content}</div>
                <div className="text-xs text-gray-500">Bài viết ID: {c.post_id}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditorComments;
