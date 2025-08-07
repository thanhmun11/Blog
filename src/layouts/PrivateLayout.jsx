import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateLayout() {
  const { user, logout } = useAuth();
  console.log("PrivateLayout is rendering", { user }); // Debug

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header - chỉ hiển thị cho admin và manager */}
      {user?.role !== "editor" && (
        <header className="bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">My Blog - {user?.role}</h1>
            <nav className="space-x-4">
              {user?.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-300 underline"
                      : "hover:text-yellow-300"
                  }
                >
                  Admin Dashboard
                </NavLink>
              )}
              {user?.role === "manager" && (
                <NavLink
                  to="/manager/dashboard"
                  className={({ isActive }) =>
                    isActive
                      ? "text-yellow-300 underline"
                      : "hover:text-yellow-300"
                  }
                >
                  Manager Dashboard
                </NavLink>
              )}
              <button
                onClick={logout}
                className="text-white hover:text-yellow-300"
              >
                Logout
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-grow py-8 ${user?.role === "editor" ? "ml-64" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2025 My Blog. All rights reserved.</p>
          <p>Contact: contact@myblog.com</p>
        </div>
      </footer>
    </div>
  );
}
