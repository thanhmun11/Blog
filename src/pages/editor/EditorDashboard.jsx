import React from "react";
import {
  ChartBarIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  InformationCircleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const EditorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <UserCircleIcon className="h-14 w-14 text-indigo-500" />
            <div>
              <h1 className="text-3xl font-bold text-indigo-700">Editor Dashboard</h1>
              <p className="text-gray-500">Quản lý bài viết, bình luận và thống kê cá nhân</p>
            </div>
          </div>
          <Link to="/editor/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            <PencilSquareIcon className="h-5 w-5" />
            Tạo bài viết mới
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <DocumentTextIcon className="h-8 w-8 text-indigo-500 mb-2" />
            <div className="text-2xl font-bold text-indigo-700">12</div>
            <div className="text-gray-500">Bài viết của bạn</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-indigo-500 mb-2" />
            <div className="text-2xl font-bold text-indigo-700">34</div>
            <div className="text-gray-500">Bình luận nhận được</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <EyeIcon className="h-8 w-8 text-indigo-500 mb-2" />
            <div className="text-2xl font-bold text-indigo-700">1,245</div>
            <div className="text-gray-500">Lượt xem tổng</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/editor/posts" className="bg-indigo-50 rounded-xl p-6 flex items-center gap-4 shadow hover:bg-indigo-100 transition">
            <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
            <div>
              <div className="text-lg font-semibold text-indigo-700">Xem tất cả bài viết</div>
              <div className="text-gray-500">Quản lý, chỉnh sửa và xóa bài viết của bạn</div>
            </div>
          </Link>
          <Link to="/editor/comments" className="bg-indigo-50 rounded-xl p-6 flex items-center gap-4 shadow hover:bg-indigo-100 transition">
            <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-indigo-500" />
            <div>
              <div className="text-lg font-semibold text-indigo-700">Quản lý bình luận</div>
              <div className="text-gray-500">Kiểm duyệt và phản hồi bình luận</div>
            </div>
          </Link>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16 mt-10">
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col gap-4 hover:scale-105 transition-transform duration-200 border-t-4 border-blue-400 w-full p-10 cursor-pointer hover:shadow-blue-200 animate-fade-in">
            <ChartBarIcon className="w-16 h-16 text-blue-500 mb-2" />
            <h2 className="text-3xl font-bold mb-1 text-blue-700">Tổng quan bài viết</h2>
            <p className="text-gray-500 text-base">Xem số lượng bài viết, trạng thái và các thống kê liên quan.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col gap-4 hover:scale-105 transition-transform duration-200 border-t-4 border-green-400 w-full p-10 cursor-pointer hover:shadow-green-200 animate-fade-in">
            <PencilSquareIcon className="w-16 h-16 text-green-500 mb-2" />
            <h2 className="text-3xl font-bold mb-1 text-green-700">Hoạt động gần đây</h2>
            <p className="text-gray-500 text-base">Theo dõi các hoạt động chỉnh sửa, bình luận mới nhất.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col gap-4 hover:scale-105 transition-transform duration-200 border-t-4 border-purple-400 w-full p-10 cursor-pointer hover:shadow-purple-200 animate-fade-in">
            <ChatBubbleBottomCenterTextIcon className="w-16 h-16 text-purple-500 mb-2" />
            <h2 className="text-3xl font-bold mb-1 text-purple-700">Bình luận & Phản hồi</h2>
            <p className="text-gray-500 text-base">Quản lý bình luận và phản hồi từ người xem.</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-full bg-white rounded-2xl shadow-xl mb-12 px-12 py-10 animate-fade-in">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Biểu đồ số lượng bài viết theo tháng</h2>
          <svg viewBox="0 0 400 120" className="w-full h-32">
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              points="0,100 50,80 100,60 150,40 200,60 250,80 300,50 350,30 400,60"
            />
            {/* Trục X */}
            <line x1="0" y1="100" x2="400" y2="100" stroke="#d1d5db" strokeWidth="2" />
            {/* Trục Y */}
            <line x1="40" y1="10" x2="40" y2="100" stroke="#d1d5db" strokeWidth="2" />
            {/* Nhãn tháng */}
            <text x="0" y="115" fontSize="12">1</text>
            <text x="50" y="115" fontSize="12">2</text>
            <text x="100" y="115" fontSize="12">3</text>
            <text x="150" y="115" fontSize="12">4</text>
            <text x="200" y="115" fontSize="12">5</text>
            <text x="250" y="115" fontSize="12">6</text>
            <text x="300" y="115" fontSize="12">7</text>
            <text x="350" y="115" fontSize="12">8</text>
            <text x="400" y="115" fontSize="12">9</text>
          </svg>
        </div>

        {/* Latest Posts Section */}
        <div className="w-full bg-white rounded-2xl shadow-xl mb-12 px-12 py-10 animate-fade-in">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Bài viết mới nhất</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Cách viết blog chuyên nghiệp</span>
              <span className="text-sm text-gray-500">08/08/2025</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Hướng dẫn sử dụng Markdown</span>
              <span className="text-sm text-gray-500">07/08/2025</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Tối ưu SEO cho bài viết</span>
              <span className="text-sm text-gray-500">06/08/2025</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditorDashboard;
