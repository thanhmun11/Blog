import React, { useState, useEffect } from "react";
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  CogIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { getPosts } from "../../services/postService";
import { getUsers } from "../../services/userService";

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from database
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getUsers()
      ]);
      
      setPosts(postsData);
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics from real data
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status !== 'inactive').length,
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    pendingPosts: posts.filter(p => p.status === 'pending').length,
    totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0),
    monthlyGrowth: 12.5 // This would be calculated from historical data
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-700 border-red-300";
      case "manager": return "bg-purple-100 text-purple-700 border-purple-300";
      case "editor": return "bg-blue-100 text-blue-700 border-blue-300";
      case "viewer": return "bg-gray-100 text-gray-700 border-gray-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getRoleText = (role) => {
    switch (role) {
      case "admin": return "Quản trị viên";
      case "manager": return "Quản lý";
      case "editor": return "Biên tập viên";
      case "viewer": return "Người xem";
      default: return role;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-300";
      case "inactive": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active": return "Hoạt động";
      case "inactive": return "Không hoạt động";
      default: return status;
    }
  };

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`);
    // Implement user actions here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
            onClick={fetchData}
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Quản lý hệ thống và người dùng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-sm text-green-600">+{stats.monthlyGrowth}% tháng này</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                <p className="text-sm text-gray-500">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tỷ lệ</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalPosts}</p>
                <p className="text-sm text-gray-500">{stats.publishedPosts} đã xuất bản</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-3xl font-bold text-orange-600">{stats.totalViews.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Tổng cộng</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <EyeIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setSelectedTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Quản lý người dùng
              </button>
              <button
                onClick={() => setSelectedTab("settings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "settings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Cài đặt hệ thống
              </button>
            </nav>
          </div>

          <div className="p-6">
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-4">Hoạt động gần đây</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">{stats.pendingPosts} bài viết chờ duyệt</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm">{stats.publishedPosts} bài viết đã xuất bản</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm">{stats.totalUsers} người dùng trong hệ thống</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Thống kê nhanh</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bài viết chờ duyệt</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingPosts}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tỷ lệ xuất bản</span>
                        <span className="font-semibold text-green-600">
                          {stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) : 0}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Lượt xem trung bình</span>
                        <span className="font-semibold text-blue-600">
                          {stats.publishedPosts > 0 ? Math.round(stats.totalViews / stats.publishedPosts) : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === "users" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm w-full sm:w-64"
                    />
                  </div>
                  
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                    <PlusIcon className="w-5 h-5" />
                    Thêm người dùng
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Người dùng
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vai trò
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trạng thái
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ngày tạo
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                {getRoleText(user.role)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status || 'active')}`}>
                                {getStatusText(user.status || 'active')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleUserAction("edit", user.id)}
                                  className="text-blue-600 hover:text-blue-900 transition-colors"
                                >
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUserAction("delete", user.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không tìm thấy người dùng
                    </h3>
                    <p className="text-gray-500">
                      Thử thay đổi từ khóa tìm kiếm hoặc thêm người dùng mới.
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedTab === "settings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                      Bảo mật hệ thống
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Xác thực 2 yếu tố</span>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                          Bật
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Giới hạn đăng nhập</span>
                        <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-400 transition-colors">
                          Tắt
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CogIcon className="w-5 h-5 text-purple-600" />
                      Cài đặt chung
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Thông báo email</span>
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors">
                          Bật
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Backup tự động</span>
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors">
                          Bật
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
