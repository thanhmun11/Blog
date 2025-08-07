import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PencilSquareIcon, DocumentTextIcon, BookOpenIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const menu = [
  {
    to: "/editor/myposts",
    label: "Bài viết của tôi",
    icon: <PencilSquareIcon className="w-5 h-5 mr-2" />,
    match: ["/editor/myposts", "/editor/posts"],
  },
  {
    to: "/editor/myall",
    label: "Tất cả bài viết của tôi",
    icon: <DocumentTextIcon className="w-5 h-5 mr-2" />,
    match: ["/editor/myall"],
  },
  {
    to: "/editor/all",
    label: "Tất cả bài viết",
    icon: <BookOpenIcon className="w-5 h-5 mr-2" />,
    match: ["/editor/all"],
  },
];

const EditorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNav = (to) => {
    navigate(to);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar sát trái, màu khác */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 p-4 border-r flex flex-col min-h-screen shadow-xl fixed left-0 top-0 bottom-0 z-20">
        {/* Header */}
        <div className="mb-8">
          <div className="text-2xl font-bold mb-2 text-white text-center tracking-wide">Editor Panel</div>
          <div className="text-sm text-gray-300 text-center">Xin chào, {user?.username || 'Editor'}</div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-2 flex-1">
          {menu.map((item) => {
            const isActive = item.match.some((m) =>
              m === location.pathname || (m.endsWith("edit") && location.pathname.startsWith(m))
            );
            return (
              <button
                key={item.to}
                onClick={() => handleNav(item.to)}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-auto pt-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-900 hover:text-white rounded-lg transition-all duration-200 font-medium group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Đăng xuất
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500 pt-4">© 2025 My Blog</div>
      </aside>
      {/* Main content + header */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Main content */}
        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EditorLayout; 