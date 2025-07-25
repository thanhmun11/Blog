import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { privateRoutes } from "./routes/privateRoutes";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./pages/public/NotFound";

function App() {
  console.log("App is rendering"); // Debug
  const routes = [
    ...publicRoutes,
    ...privateRoutes.map((route) => ({
      ...route,
      children: route.children.map((child) => ({
        ...child,
        element: (
          <PrivateRoute allowedRoles={child.allowedRoles}>
            {child.element}
          </PrivateRoute>
        ),
      })),
    })),
    { path: "*", element: <NotFound /> },
  ];

  return useRoutes(routes);
}

export default App;
