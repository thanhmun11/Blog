import PrivateLayout from "../layouts/PrivateLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import EditorPosts from "../pages/editor/EditorPosts";
import ManagerDashboard from "../pages/manager/ManagerDashboard";

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
        path: "/editor/posts",
        element: <EditorPosts />,
        allowedRoles: ["editor"],
      },
      {
        path: "/manager/dashboard",
        element: <ManagerDashboard />,
        allowedRoles: ["manager"],
      },
    ],
  },
];
