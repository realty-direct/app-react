import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../App";
import "./index.css";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import Create from "./routes/Create";
import Edit from "./routes/Edit";
import Home from "./routes/Home";
import Property from "./routes/Property";
import Signup from "./routes/Signup";
import Signin from "./routes/Singin";

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
            path: "", // Default route for /property/:id
            Component: Property,
          },
          // {
          //   path: "enquiries",
          //   Component: Enquiries, // Enquiries page
          // },
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
