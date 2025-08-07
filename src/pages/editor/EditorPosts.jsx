import React, { useState, useEffect } from "react";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { getPosts, updatePost, deletePost, createComment, getComments } from "../../services/postService";
import { useAuth } from "../../contexts/AuthContext";
import { slugify } from "../../utils/slugify";

const EditorPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);
  const [form, setForm] = useState({ title: "", content: "", excerpt: "" });
  const [formMode, setFormMode] = useState("create");
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedComments, setExpandedComments] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch posts from database
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getPosts();
      
      // Filter posts by current user (for editors)
      const userPosts = postsData.filter(post => post.author_id === user?.id);
      setPosts(userPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  // Handle view post detail
  const handleViewDetail = (post) => {
    setSelectedPost(post);
    setShowDetail(true);
  };

  // Handle form submission
  const handleSubmit = async (status) => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Vui lòng điền đầy đủ tiêu đề và nội dung!");
      return;
    }

    try {
      setSubmitting(true);
      const postData = {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        slug: slugify(form.title), // Tạo slug từ tiêu đề
        status: status
      };

      if (formMode === "create") {
        await createPost(postData);
      } else if (formMode === "edit" && editPost) {
        await updatePost(editPost.id, postData);
      }

      setShowForm(false);
      setForm({ title: "", content: "", excerpt: "" });
      setEditPost(null);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Error saving post:', err);
      alert("Lưu bài viết thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete post
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      await deletePost(id);
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Error deleting post:', err);
      alert("Xóa bài viết thất bại. Vui lòng thử lại!");
    }
  };

  // Handle submit for review
  const handleSubmitForReview = async (id) => {
    try {
      await updatePost(id, { status: "pending" });
      fetchPosts(); // Refresh posts
    } catch (err) {
      console.error('Error submitting for review:', err);
      alert("Gửi duyệt thất bại. Vui lòng thử lại!");
    }
  };

  // Handle add comment
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      await createComment({
        content: text,
        post_id: postId
      });
      setCommentInputs({ ...commentInputs, [postId]: "" });
      fetchPosts(); // Refresh posts to get updated comments
    } catch (err) {
      console.error('Error adding comment:', err);
      alert("Thêm bình luận thất bại. Vui lòng thử lại!");
    }
  };

  // Toggle comment expansion
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesStatus = selectedStatus === "all" || post.status === selectedStatus;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: posts.length,
    draft: posts.filter(p => p.status === "draft").length,
    pending: posts.filter(p => p.status === "pending").length,
    published: posts.filter(p => p.status === "published").length,
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Thử lại
          </button>
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
            Quản lý bài viết
          </h1>
          <p className="text-gray-600 text-lg">Tạo, chỉnh sửa và quản lý bài viết của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nháp</p>
                <p className="text-3xl font-bold text-gray-900">{stats.draft}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã xuất bản</p>
                <p className="text-3xl font-bold text-green-600">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 animate-slide-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm w-full sm:w-64"
              />
            </div>
            
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              setFormMode("create");
              setForm({ title: "", content: "", excerpt: "" });
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            Tạo bài viết mới
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">
                  {formMode === "create" ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text"
                    placeholder="Nhập tiêu đề bài viết..."
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tóm tắt bài viết
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                    placeholder="Tóm tắt ngắn gọn về bài viết..."
                    value={form.excerpt}
                    onChange={e => setForm({ ...form, excerpt: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung bài viết *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[300px] resize-y"
                    placeholder="Viết nội dung bài viết của bạn..."
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowForm(false)}
                  disabled={submitting}
                >
                  Hủy
                </button>
                <button
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  onClick={() => handleSubmit("draft")}
                  disabled={submitting}
                >
                  {submitting ? "Đang lưu..." : "Lưu nháp"}
                </button>
                <button
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  onClick={() => handleSubmit("pending")}
                  disabled={submitting}
                >
                  {submitting ? "Đang gửi..." : "Gửi duyệt"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Post Detail Modal */}
        {showDetail && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-900">Chi tiết bài viết</h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Tạo: {formatDate(selectedPost.created_at)}
                    </div>
                    {selectedPost.updated_at !== selectedPost.created_at && (
                      <div className="flex items-center gap-1">
                        <ArrowPathIcon className="w-4 h-4" />
                        Cập nhật: {formatDate(selectedPost.updated_at)}
                      </div>
                    )}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPost.status)}`}>
                      {getStatusIcon(selectedPost.status)}
                      {getStatusText(selectedPost.status)}
                    </span>
                  </div>
                  
                  {selectedPost.excerpt && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tóm tắt:</h4>
                      <p className="text-gray-700">{selectedPost.excerpt}</p>
                    </div>
                  )}
                  
                  <div className="prose max-w-none">
                    <h4 className="font-semibold text-gray-900 mb-2">Nội dung:</h4>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {selectedPost.content}
                    </div>
                  </div>
                </div>
                
                {/* Comments Section */}
                {selectedPost.comments && selectedPost.comments.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      Bình luận ({selectedPost.comments.length})
                    </h4>
                    
                    <div className="space-y-3">
                      {selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
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
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
                <button
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDetail(false)}
                >
                  Đóng
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    setShowDetail(false);
                    setFormMode("edit");
                    setEditPost(selectedPost);
                    setForm({ 
                      title: selectedPost.title, 
                      content: selectedPost.content, 
                      excerpt: selectedPost.excerpt || "" 
                    });
                    setShowForm(true);
                  }}
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-6 animate-fade-in">
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </div>
                      {post.updated_at !== post.created_at && (
                        <div className="flex items-center gap-1">
                          <ArrowPathIcon className="w-4 h-4" />
                          Cập nhật: {formatDate(post.updated_at)}
                        </div>
                      )}
                    </div>
                    {post.excerpt && (
                      <p className="text-gray-700 line-clamp-3 mb-3">{post.excerpt}</p>
                    )}
                    <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                      {getStatusIcon(post.status)}
                      {getStatusText(post.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(post)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    
                    <button
                      onClick={() => {
                        setFormMode("edit");
                        setEditPost(post);
                        setForm({ 
                          title: post.title, 
                          content: post.content, 
                          excerpt: post.excerpt || "" 
                        });
                        setShowForm(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    
                    {post.status === "draft" && (
                      <button
                        onClick={() => handleSubmitForReview(post.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                        Gửi duyệt
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      {post.comments?.length || 0} bình luận
                    </div>
                    
                    {post.comments && post.comments.length > 0 && (
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {expandedComments[post.id] ? "Ẩn bình luận" : "Xem bình luận"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Comments Section */}
              {expandedComments[post.id] && post.comments && (
                <div className="border-t border-gray-100 bg-gray-50 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    Bình luận ({post.comments.length})
                  </h4>
                  
                  <div className="space-y-3 mb-4">
                    {post.comments.map((comment) => (
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
                  
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      type="text"
                      placeholder="Viết bình luận..."
                      value={commentInputs[post.id] || ""}
                      onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={e => { if (e.key === "Enter") handleAddComment(post.id); }}
                    />
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleAddComment(post.id)}
                    >
                      Gửi
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedStatus === "all" ? "Chưa có bài viết nào" : `Không có bài viết ${getStatusText(selectedStatus).toLowerCase()}`}
              </h3>
              <p className="text-gray-500 mb-6">
                {selectedStatus === "all" 
                  ? "Bắt đầu tạo bài viết đầu tiên của bạn!" 
                  : `Tất cả bài viết đã được ${selectedStatus === "draft" ? "gửi duyệt" : "xử lý"}`
                }
              </p>
              {selectedStatus === "all" && (
                <button
                  onClick={() => {
                    setFormMode("create");
                    setForm({ title: "", content: "", excerpt: "" });
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <PlusIcon className="w-5 h-5" />
                  Tạo bài viết đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPosts;
