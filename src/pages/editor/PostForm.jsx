import React, { useState } from "react";
import {
  DocumentTextIcon,
  PhotoIcon,
  TagIcon,
  EyeIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { slugify } from "../../utils/slugify";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const PostForm = ({ onSave, onCancel, initialData = null }) => {
  // Validate required props
  if (!onSave || !onCancel) {
    console.error('PostForm requires onSave and onCancel props');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lỗi cấu hình</h3>
          <p className="text-gray-600">Component PostForm cần props onSave và onCancel</p>
        </div>
      </div>
    );
  }
  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    category: initialData?.category || "",
    tags: initialData?.tags || [],
    featuredImage: initialData?.featuredImage || "",
    status: initialData?.status || "draft"
  });

  const [isPreview, setIsPreview] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "Công nghệ",
    "Lập trình",
    "Design",
    "Marketing",
    "Kinh doanh",
    "Giáo dục",
    "Sức khỏe",
    "Du lịch"
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({
        ...form,
        tags: [...form.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm({
      ...form,
      tags: form.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (status) => {
    const postData = {
      ...form,
      status,
      image_url: form.featuredImage,
      slug: slugify(form.title),
    };
    delete postData.featuredImage;
    onSave(postData);
  };

  const generateExcerpt = () => {
    const excerpt = form.content.substring(0, 150) + (form.content.length > 150 ? "..." : "");
    setForm({ ...form, excerpt });
  };

  // Xử lý upload ảnh đại diện
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      // Gọi endpoint upload ảnh (bạn cần có /api/upload ở backend)
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm({ ...form, featuredImage: res.data.url });
    } catch (err) {
      alert("Upload ảnh thất bại!");
    }
  };

  const { user } = useAuth();
  console.log('DEBUG user:', user);
  console.log('DEBUG initialData:', initialData);
  console.log('DEBUG initialData.author_id:', initialData?.author_id);
  console.log('DEBUG user.id:', user?.id);
  console.log('DEBUG user.role:', user?.role);
  
  // So sánh với kiểu dữ liệu đúng
  const canEdit = user && (
    !initialData || // Tạo bài viết mới - luôn cho phép
    user.role === 'admin' || 
    user.role === 'manager' || 
    Number(user.id) === Number(initialData?.author_id)
  );
  
  console.log('DEBUG canEdit:', canEdit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                Quay lại
              </button>
            </div>
            {/* Nút gửi duyệt hoặc lưu nháp */}
            {canEdit && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSubmit("draft")}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Lưu nháp
                </button>
                <button
                  onClick={() => handleSubmit("pending")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Gửi duyệt
                </button>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {initialData ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
          </h1>
          <p className="text-gray-600 text-lg">
            {initialData ? "Cập nhật nội dung bài viết của bạn" : "Viết và xuất bản bài viết mới"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài viết *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nhập tiêu đề bài viết..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
              />
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung bài viết *
                </label>
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="inline-flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <EyeIcon className="w-4 h-4" />
                  {isPreview ? "Chỉnh sửa" : "Xem trước"}
                </button>
              </div>

              {isPreview ? (
                <div className="prose max-w-none">
                  <h1>{form.title}</h1>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {form.content}
                  </div>
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Viết nội dung bài viết của bạn..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[400px] resize-y"
                />
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tóm tắt bài viết
                </label>
                <button
                  onClick={generateExcerpt}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Tự động tạo
                </button>
              </div>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Tóm tắt ngắn gọn về bài viết..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-purple-600" />
                Danh mục
              </h3>

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5 text-green-600" />
                Tags
              </h3>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Thêm tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900 transition-colors"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PhotoIcon className="w-5 h-5 text-orange-600" />
                Ảnh đại diện
              </h3>

              <div className="space-y-3">
                <input
                  type="url"
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="URL ảnh đại diện..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                {form.featuredImage && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mt-2">
                    <img
                      src={form.featuredImage.startsWith('http') ? form.featuredImage : `http://localhost:5000${form.featuredImage}`}
                      alt="Featured"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;  