import PrivateLayout from "../layouts/PrivateLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EditorLayout from "../layouts/EditorLayout";
import MyPosts from "../pages/editor/MyPosts";
import CreatePost from "../pages/editor/CreatePost";
import AllPosts from "../pages/editor/AllPosts";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import MyAllPosts from "../pages/editor/MyAllPosts";
import MyPostDetail from "../pages/editor/MyPostDetail";
import AllPostDetail from "../pages/editor/AllPostDetail";

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
        path: "/editor",
        element: <EditorLayout />,
        allowedRoles: ["editor"],
        children: [
          { path: "myposts", element: <MyPosts />, allowedRoles: ["editor"] },
          { path: "posts", element: <MyPosts />, allowedRoles: ["editor"] },
          { path: "create", element: <CreatePost />, allowedRoles: ["editor"] },
          { path: "edit/:id", element: <CreatePost />, allowedRoles: ["editor"] },
          { path: "all", element: <AllPosts />, allowedRoles: ["editor"] },
          { path: "myall", element: <MyAllPosts />, allowedRoles: ["editor"] },
          { path: "myall/:id", element: <MyPostDetail />, allowedRoles: ["editor"] },
          { path: "all/:id", element: <AllPostDetail />, allowedRoles: ["editor"] },
        ],
      },
      {
        path: "/manager/dashboard",
        element: <ManagerDashboard />,
        allowedRoles: ["manager"],
      },
    ],
  },
];
