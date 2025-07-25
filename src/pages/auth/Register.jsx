import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setSuccess("Tạo tài khoản thành công! Chuyển sang trang đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Đăng ký</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
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
          Đăng ký
        </button>
        <p className="mt-4 text-center text-gray-600">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </form>
    </div>
  );
}
