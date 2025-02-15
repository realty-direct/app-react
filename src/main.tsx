import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "../App";

import "./index.css";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import { signOut } from "./lib/supabase";
import Confirm from "./routes/Confirm";
import Create from "./routes/Create/Create";
import Edit from "./routes/Edit/Edit";
import Guide from "./routes/Guide";
import Home from "./routes/Home";
import Orders from "./routes/Orders";
import Property from "./routes/Property";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import useRealtyStore from "./store/store";

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
        action: async () => {
          const { clearSession } = useRealtyStore.getState(); // ✅ Get Zustand's clearSession
          clearSession(); // ✅ Clear Zustand session state
          await signOut(); // ✅ Then sign out from Supabase
          window.location.href = "/signin"; // ✅ Redirect after logout
        },
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
