import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "../App";

import "./index.css";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import PublicRoute from "./layouts/PublicRoute";
import AccountManagement from "./routes/AccountManagement";
import Confirm from "./routes/Confirm";
import Conveyancing from "./routes/Conveyancing";
import Create from "./routes/Create";
import Edit from "./routes/Edit/Edit";
import Guide from "./routes/Guide";
import Home from "./routes/Home";
import Logout from "./routes/Logout";
import Orders from "./routes/Orders";
import Property from "./routes/Property";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      // 🌐 Public Routes (Only for unauthenticated users)
      {
        path: "signin",
        element: (
          <PublicRoute>
            <Signin />
          </PublicRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },

      // ✅ Always accessible routes (e.g., email confirmation, logout)
      { path: "confirm", Component: Confirm },
      { path: "logout", Component: Logout },

      // 🔒 Protected Routes (For authenticated users only)
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <HomeLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "", Component: Home },
          { path: "guide", Component: Guide },
          { path: "account", Component: AccountManagement },
          { path: "conveyancing", Component: Conveyancing },
        ],
      },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <PropertyEditLayout />
          </ProtectedRoute>
        ),
        children: [{ path: "", Component: Create }],
      },
      {
        path: "property/:id",
        element: (
          <ProtectedRoute>
            <PropertyLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "", Component: Property },
          { path: "orders", Component: Orders },
        ],
      },
      {
        path: "property/:id/edit",
        element: (
          <ProtectedRoute>
            <PropertyEditLayout />
          </ProtectedRoute>
        ),
        children: [{ path: "", Component: Edit }],
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
