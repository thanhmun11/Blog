import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  PencilIcon,
  CalendarIcon,
  UserIcon
} from "@heroicons/react/24/outline";

import { getPosts, getComments, createComment } from "../../services/postService";
import { getCurrentUser } from "../../services/authService";

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
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        console.log('Current user:', currentUser); // Debug
        
        const allPosts = await getPosts();
        console.log('All posts:', allPosts); // Debug
        
        // Lọc bài viết của user hiện tại (chỉ bài đã duyệt)
        const myPosts = allPosts.filter(post =>
          (post.author_id === currentUser?.id || post.author_id === currentUser?.userId) && post.status === 'published'
        );
        console.log('My posts:', myPosts); // Debug
        
        setPosts(myPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleShowComments = async (postId) => {
    setCommentsLoading(true);
    setShowComments(postId);
    try {
      const commentsData = await getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentInput.trim()) return;
    setAddingComment(true);
    try {
      await createComment({
        content: commentInput,
        post_id: parseInt(postId)
      });
      setCommentInput("");
      handleShowComments(postId); // reload comments
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setAddingComment(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-700 border-gray-300";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "published": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft": return <DocumentTextIcon className="w-4 h-4" />;
      case "pending": return <ClockIcon className="w-4 h-4" />;
      case "published": return <CheckCircleIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "draft": return "Nháp";
      case "pending": return "Chờ duyệt";
      case "published": return "Đã xuất bản";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tất cả bài viết của tôi
          </h1>
          <p className="text-gray-600 text-lg">Xem tất cả bài viết của bạn ở mọi trạng thái</p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                    {getStatusIcon(post.status)}
                    {getStatusText(post.status)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(post.created_at)}
                  </div>
                </div>
                
                {post.excerpt && (
                  <p className="text-gray-700 line-clamp-3 mb-4">{post.excerpt}</p>
                )}
                
                <p className="text-gray-700 line-clamp-4 mb-4">{post.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor/myall/${post.id}`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              {showComments === post.id && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PencilIcon className="w-5 h-5" />
                    Bình luận ({comments.length})
                  </h4>
                  
                  {commentsLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 text-sm mt-2">Đang tải bình luận...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <PencilIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Chưa có bình luận nào.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.author_name || "Người dùng"}</span>
                                <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      placeholder="Viết bình luận..."
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleAddComment(post.id); }}
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
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
          
          {posts.length === 0 && (
            <div className="col-span-full text-center py-12 animate-fade-in">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài viết nào</h3>
              <p className="text-gray-500 mb-6">Bắt đầu tạo bài viết đầu tiên của bạn!</p>
              <button
                onClick={() => navigate('/editor/create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <DocumentTextIcon className="w-5 h-5" />
                Tạo bài viết đầu tiên
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAllPosts; 