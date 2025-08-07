import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts } from "../../services/postService";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  return (
    <div className="w-full p-0">
      <h2 className="text-2xl font-bold mb-4">Bài viết cộng đồng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border hover:shadow-2xl transition cursor-pointer"
            onClick={() => navigate(`/editor/all/${post.id}`)}
          >
            <img
              src={post.image_url || "https://source.unsplash.com/400x200/?blog,community"}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-5 flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                <span className="px-2 py-1 rounded text-xs font-medium ml-2 bg-green-100 text-green-700">Đã duyệt</span>
              </div>
              <div className="text-sm text-gray-500">Tác giả: {post.author_name || post.author || "-"}</div>
              <div className="text-sm text-gray-500">Ngày tạo: {post.createdAt || "-"}</div>
              <div className="text-gray-700 line-clamp-2">{post.excerpt || post.content?.slice(0, 100) || "Không có mô tả."}</div>
            </div>
          </div>
        ))}
        {posts.length === 0 && <div className="col-span-2 text-center text-gray-400">Chưa có bài viết nào đã duyệt.</div>}
      </div>
    </div>
  );
};

export default AllPosts; 