import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "../App";

import "./index.css";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import AccountManagement from "./routes/AccountManagement";
import Confirm from "./routes/Confirm";
import Create from "./routes/Create/Create";
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
    Component: App, // Root component wrapping everything
    children: [
      {
        path: "/", // Home and other top-level routes

        Component: HomeLayout,
        children: [
          {
            path: "",
            Component: Home,
          },
          {
            path: "guide",
            Component: Guide,
          },
          {
            path: "account",
            Component: AccountManagement,
          },
        ],
      },
      {
        path: "signin",
        Component: Signin,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path: "confirm",
        Component: Confirm,
      },
      {
        path: "logout",
        Component: Logout,
      },

      {
        path: "create",
        Component: PropertyEditLayout,
        children: [
          {
            path: "",
            Component: Create,
          },
        ],
      },
      {
        path: "property/:id", // Base path for property routes
        Component: PropertyLayout, // Layout for /property/:id and related views
        children: [
          {
            path: "",
            Component: Property,
          },
          {
            path: "orders",
            Component: Orders, // Enquiries page
          },
        ],
      },
      {
        path: "property/:id/edit",
        Component: PropertyEditLayout, // Separate layout for editing
        children: [
          {
            path: "",
            Component: Edit, // Edit property view
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
