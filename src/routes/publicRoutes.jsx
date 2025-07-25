import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/public/Home";
import BlogPost from "../pages/public/BlogPost";
import About from "../pages/public/About";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

export const publicRoutes = [
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/posts/:id", element: <BlogPost /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
];
