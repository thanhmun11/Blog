import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  // console.log(user);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      // console.log(user);
      // Chuyển hướng theo vai trò
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "editor":
          navigate("/editor/posts");
          break;
        case "manager":
          navigate("/manager/dashboard");
          break;
        default:
          navigate("/"); // Viewer hoặc vai trò không xác định
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Đăng nhập</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Tên đăng nhập"
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          className="w-full border px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Đăng nhập
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Đăng ký
        </a>
      </p>
    </div>
  );
}
