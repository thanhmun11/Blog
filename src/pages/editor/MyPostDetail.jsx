import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById, getComments, createComment } from "../../services/postService";
import { getCurrentUser } from "../../services/authService";

const MyPostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          getPostById(id),
          getComments(id)
        ]);
        setPost(postData);
        setComments(commentsData);
        setLoading(false);
        setCommentsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    setAddingComment(true);
    try {
      const currentUser = getCurrentUser();
      await createComment({
        content: commentInput,
        post_id: parseInt(id),
        author_id: currentUser?.userId || 1
      });
      setCommentInput("");
      // Reload comments
      const updatedComments = await getComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!post) return <div>Không tìm thấy bài viết.</div>;

  return (
    <div className="w-full p-0">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <div className="text-gray-500 mb-2">Ngày tạo: {post.createdAt || "-"}</div>
      <div className="mb-6 text-gray-800 whitespace-pre-line">{post.content}</div>
      <div className="bg-gray-50 p-4 rounded border">
        <h4 className="font-semibold mb-2 text-lg">Bình luận</h4>
        {commentsLoading ? (
          <div>Đang tải bình luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-gray-400 text-sm">Chưa có bình luận nào.</div>
        ) : (
          <ul className="space-y-2 mb-2">
            {comments.map((c) => (
              <li key={c.id} className="text-sm border-b last:border-b-0 pb-1">
                <span className="font-medium">
                  {c.author === getCurrentUser() ? `${c.author} (Bạn)` : c.author}
                </span>: {c.content}
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
            onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded"
            onClick={handleAddComment}
            disabled={addingComment}
          >
            {addingComment ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPostDetail; 