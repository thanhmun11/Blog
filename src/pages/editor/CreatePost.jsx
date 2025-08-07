import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostForm from "./PostForm";
import { createPost, updatePost, getPostById } from "../../services/postService";
import { slugify } from "../../utils/slugify";

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Load post data if editing
  React.useEffect(() => {
    if (id) {
      const loadPost = async () => {
        try {
          setLoading(true);
          const post = await getPostById(id);
          setInitialData(post);
        } catch (error) {
          console.error('Error loading post:', error);
          alert('Không thể tải bài viết. Vui lòng thử lại!');
          navigate('/editor/posts');
        } finally {
          setLoading(false);
        }
      };
      loadPost();
    }
  }, [id, navigate]);

  const handleSave = async (postData) => {
    try {
      setLoading(true);
      
      if (id) {
        // Update existing post
        await updatePost(id, {
          ...postData,
          slug: slugify(postData.title)
        });
        alert('Cập nhật bài viết thành công!');
      } else {
        // Create new post
        await createPost({
          ...postData,
          slug: slugify(postData.title)
        });
        alert('Tạo bài viết thành công!');
      }
      
      navigate('/editor/posts');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Lưu bài viết thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/editor/posts');
  };

  if (loading && id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
  <div className="w-full p-0">
      <PostForm
        onSave={handleSave}
        onCancel={handleCancel}
        initialData={initialData}
      />
    </div>
  );
};

export default CreatePost; 