import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PencilSquareIcon, DocumentTextIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import React from "react";

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

const getCurrentUser = () => ({ username: "editor", role: "Editor" }); // Giả lập user

const EditorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleNav = (to) => {
    navigate(to);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar sát trái, màu khác */}
      <aside className="w-64 bg-gray-100 p-4 border-r flex flex-col min-h-screen shadow-md fixed left-0 top-0 bottom-0 z-20">
        <div className="text-2xl font-bold mb-8 text-blue-600 text-center tracking-wide">Editor Panel</div>
        <nav className="flex flex-col gap-2 flex-1">
          {menu.map((item) => {
            const isActive = item.match.some((m) =>
              m === location.pathname || (m.endsWith("edit") && location.pathname.startsWith(m))
            );
            return (
              <button
                key={item.to}
                onClick={() => handleNav(item.to)}
                className={`flex items-center w-full text-left px-4 py-2 rounded transition-colors font-medium hover:bg-blue-50 hover:text-blue-600 ${isActive ? "bg-blue-600 text-white" : "text-gray-700"}`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto text-center text-xs text-gray-400 pt-4 border-t">© 2025 My Blog</div>
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