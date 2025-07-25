import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/posts";
const COMMENTS_URL = "http://localhost:3000/comments";
const getCurrentUser = () => "editor";

const MyAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(null); // postId
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}?author=${getCurrentUser()}&status=published`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleShowComments = (postId) => {
    setCommentsLoading(true);
    setShowComments(postId);
    fetch(`${COMMENTS_URL}?postId=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data);
        setCommentsLoading(false);
      });
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    setAddingComment(true);
    await fetch(COMMENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        author: getCurrentUser(),
        content: commentInput,
        createdAt: new Date().toISOString(),
      }),
    });
    setCommentInput("");
    handleShowComments(postId); // reload comments
    setAddingComment(false);
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả bài viết của tôi (đã duyệt)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded shadow p-5 flex flex-col gap-2 border hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/editor/myall/${post.id}`)}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate">{post.title}</h3>
              <span className="px-2 py-1 rounded text-xs font-medium ml-2 bg-green-100 text-green-700">Đã duyệt</span>
            </div>
            <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt || "-"}</div>
            <div className="text-gray-700 mb-2">{post.content}</div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm" onClick={() => handleShowComments(post.id)}>
                Xem bình luận
              </button>
            </div>
            {showComments === post.id && (
              <div className="mt-2 bg-gray-50 p-2 rounded border">
                <h4 className="font-semibold mb-1 text-sm">Bình luận</h4>
                {commentsLoading ? (
                  <div>Đang tải bình luận...</div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-400 text-sm">Chưa có bình luận nào.</div>
                ) : (
                  <ul className="space-y-1 mb-2">
                    {comments.map((c) => (
                      <li key={c.id} className="text-sm border-b last:border-b-0 pb-1">
                        <span className="font-medium">{c.author}:</span> {c.content}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2 mt-2">
                  <input
                    className="border p-1 flex-1"
                    type="text"
                    placeholder="Viết bình luận..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleAddComment(post.id); }}
                  />
                  <button
                    className="bg-blue-400 text-white px-2 rounded"
                    onClick={() => handleAddComment(post.id)}
                    disabled={addingComment}
                  >
                    {addingComment ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-2 text-center text-gray-400">Chưa có bài viết nào đã duyệt.</div>}
      </div>
    </div>
  );
};

export default MyAllPosts; 