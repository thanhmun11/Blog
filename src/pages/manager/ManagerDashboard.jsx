import React, { useEffect, useState } from "react";
import { getPosts, updatePost } from "../../services/postService";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const ManagerDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch posts from database
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Không thể tải danh sách bài viết. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle view post detail
  const handleViewDetail = (post) => {
    setSelectedPost(post);
    setShowDetail(true);
  };

  // Approve post
  const handleApprove = async (post) => {
    try {
      await updatePost(post.id, { ...post, status: "published" });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error approving post:', error);
      alert("Duyệt bài viết thất bại. Vui lòng thử lại!");
    }
  };

  // Reject post
  const handleReject = async (post) => {
    try {
      await updatePost(post.id, { ...post, status: "draft" });
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Error rejecting post:', error);
      alert("Từ chối bài viết thất bại. Vui lòng thử lại!");
    }
  };

  // Filter posts by status and search
  const filteredPosts = posts.filter(post => {
    const matchesFilter = selectedFilter === "all" || post.status === selectedFilter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.author_name && post.author_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    total: posts.length,
    pending: posts.filter(p => p.status === "pending").length,
    published: posts.filter(p => p.status === "published").length,
    draft: posts.filter(p => p.status === "draft").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "published": return "bg-green-100 text-green-700 border-green-300";
      case "draft": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <ClockIcon className="w-4 h-4" />;
      case "published": return <CheckCircleIcon className="w-4 h-4" />;
      case "draft": return <DocumentTextIcon className="w-4 h-4" />;
      default: return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Chờ duyệt";
      case "published": return "Đã xuất bản";
      case "draft": return "Nháp";
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
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
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
          <p className="text-gray-600 text-lg">Duyệt và quản lý bài viết từ các tác giả</p>
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
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nháp</p>
                <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-gray-600" />
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
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Nháp</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Hiển thị {filteredPosts.length} trong tổng số {posts.length} bài viết
          </div>
        </div>

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
                      <UserIcon className="w-4 h-4" />
                      {selectedPost.author_name || "Tác giả"}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(selectedPost.created_at)}
                    </div>
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
                {selectedPost.status === "pending" && (
                  <>
                    <button
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => {
                        handleApprove(selectedPost);
                        setShowDetail(false);
                      }}
                    >
                      Duyệt bài viết
                    </button>
                    <button
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => {
                        handleReject(selectedPost);
                        setShowDetail(false);
                      }}
                    >
                      Từ chối
                    </button>
                  </>
                )}
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
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        {getStatusText(post.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {post.author_name || "Tác giả"}
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </div>
                    </div>
                    
                    {post.excerpt && (
                      <p className="text-gray-700 line-clamp-3 leading-relaxed mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="text-gray-700 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(post)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                    
                    {post.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(post)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <CheckBadgeIcon className="w-4 h-4" />
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(post)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm hover:shadow-md"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          Từ chối
                        </button>
                      </>
                    )}
                    
                    {post.status === "published" && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                        <CheckCircleIcon className="w-4 h-4" />
                        Đã duyệt
                      </span>
                    )}
                    
                    {post.status === "draft" && (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">
                        <DocumentTextIcon className="w-4 h-4" />
                        Nháp
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {selectedFilter === "all" ? "Không có bài viết nào" : `Không có bài viết ${getStatusText(selectedFilter).toLowerCase()}`}
              </h3>
              <p className="text-gray-500">
                {selectedFilter === "all" 
                  ? "Chưa có bài viết nào được tạo." 
                  : `Tất cả bài viết đã được ${selectedFilter === "pending" ? "xử lý" : "duyệt"}`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
