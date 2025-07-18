import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Blog</h1>
          <nav className="space-x-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 underline" : "hover:text-yellow-300"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 underline" : "hover:text-yellow-300"
              }
            >
              About
            </NavLink>
            {user ? (
              <>
                <span className="text-white">Hello, {user.username}</span>
                <button
                  onClick={logout}
                  className="text-white hover:text-yellow-300"
                >
                  Logout
                </button>
              </>
            ) : (
              // <button></button>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 underline"
                    : "hover:text-yellow-300"
                }
              >
                Login
              </NavLink>
            )}
            <NavLink
              to="/register"
              className={({ isActive }) =>
                isActive ? "text-yellow-300 underline" : "hover:text-yellow-300"
              }
            >
              Register
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-8">
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
