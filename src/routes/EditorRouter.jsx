import { Route, Routes } from "react-router-dom";
import EditorLayout from "../layouts/EditorLayout";
import MyPosts from "../pages/editor/MyPosts";
import PostForm from "../pages/editor/PostForm";
import AllPosts from "../pages/editor/AllPosts";
import EditorDashboard from "../pages/editor/EditorDashboard";
import EditorComments from "../pages/editor/EditorComments";

const EditorRouter = () => (
  <Routes>
    <Route path="/editor" element={<EditorLayout />}>
  <Route path="dashboard" element={<EditorDashboard />} />
  <Route path="myposts" element={<MyPosts />} />
  <Route path="create" element={<PostForm />} />
  <Route path="edit/:id" element={<PostForm />} />
  <Route path="all" element={<AllPosts />} />
  <Route path="comments" element={<EditorComments />} />
    </Route>
  </Routes>
);

export default EditorRouter; 