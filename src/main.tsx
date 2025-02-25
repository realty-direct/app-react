import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "../App";
import "./index.css";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import ProtectedRoute from "./layouts/ProtectedLayout";
import AccountManagement from "./routes/AccountManagement";
import Confirm from "./routes/Confirm";
import Conveyancing from "./routes/Conveyancing";
import Create from "./routes/Create";
import Edit from "./routes/Edit/Edit";
import Guide from "./routes/Guide";
import Home from "./routes/Home";
import Orders from "./routes/Orders";
import Property from "./routes/Property";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/signin",
        Component: Signin,
      },
      {
        path: "/signup",
        Component: Signup,
      },
      {
        path: "/confirm",
        Component: Confirm,
      },

      // 🔒 Protected routes
      {
        element: <ProtectedRoute />, // ✅ Protect these routes
        children: [
          {
            path: "/",
            Component: HomeLayout,
            children: [
              { path: "", Component: Home },
              { path: "guide", Component: Guide },
              { path: "account", Component: AccountManagement },
              { path: "conveyancing", Component: Conveyancing },
            ],
          },
          {
            path: "create",
            Component: PropertyEditLayout,
            children: [{ path: "", Component: Create }],
          },
          {
            path: "property/:id",
            Component: PropertyLayout,
            children: [
              { path: "", Component: Property },
              { path: "orders", Component: Orders },
            ],
          },
          {
            path: "property/:id/edit",
            Component: PropertyEditLayout,
            children: [{ path: "", Component: Edit }],
          },
        ],
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
