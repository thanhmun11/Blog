import PrivateLayout from "../layouts/PrivateLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
<<<<<<< HEAD
import EditorLayout from "../layouts/EditorLayout";
import MyPosts from "../pages/editor/MyPosts";
import PostForm from "../pages/editor/PostForm";
import AllPosts from "../pages/editor/AllPosts";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MyAllPosts from "../pages/editor/MyAllPosts";
import MyPostDetail from "../pages/editor/MyPostDetail";
import AllPostDetail from "../pages/editor/AllPostDetail";
=======
import EditorPosts from "../pages/editor/EditorPosts";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
>>>>>>> db0fb3b675d7a938a732f073d3ba98569a8501ad

export const privateRoutes = [
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        allowedRoles: ["admin"],
      },
      {
<<<<<<< HEAD
        path: "/editor",
        element: <EditorLayout />,
        allowedRoles: ["editor"],
        children: [
          { path: "myposts", element: <MyPosts />, allowedRoles: ["editor"] },
          { path: "posts", element: <MyPosts />, allowedRoles: ["editor"] },
          { path: "create", element: <PostForm />, allowedRoles: ["editor"] },
          { path: "edit/:id", element: <PostForm />, allowedRoles: ["editor"] },
          { path: "all", element: <AllPosts />, allowedRoles: ["editor"] },
          { path: "myall", element: <MyAllPosts />, allowedRoles: ["editor"] },
          { path: "myall/:id", element: <MyPostDetail />, allowedRoles: ["editor"] },
          { path: "all/:id", element: <AllPostDetail />, allowedRoles: ["editor"] },
        ],
=======
        path: "/editor/posts",
        element: <EditorPosts />,
        allowedRoles: ["editor"],
>>>>>>> db0fb3b675d7a938a732f073d3ba98569a8501ad
      },
      {
        path: "/manager/dashboard",
        element: <ManagerDashboard />,
        allowedRoles: ["manager"],
      },
    ],
  },
];
