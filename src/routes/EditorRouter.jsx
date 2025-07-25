import { Route, Routes } from "react-router-dom";
import EditorLayout from "../layouts/EditorLayout";
import MyPosts from "../pages/editor/MyPosts";
import PostForm from "../pages/editor/PostForm";
import AllPosts from "../pages/editor/AllPosts";

const EditorRouter = () => (
  <Routes>
    <Route path="/editor" element={<EditorLayout />}>
      <Route path="myposts" element={<MyPosts />} />
      <Route path="create" element={<PostForm />} />
      <Route path="edit/:id" element={<PostForm />} />
      <Route path="all" element={<AllPosts />} />
    </Route>
  </Routes>
);

export default EditorRouter; 