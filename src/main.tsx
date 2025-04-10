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
    element: <App />, // ✅ Use element instead of Component
    children: [
      { path: "/signin", element: <Signin /> },
      { path: "/signup", element: <Signup /> },
      { path: "/confirm", element: <Confirm /> },
      {
        element: <ProtectedRoute />, // ✅ Protect these routes
        children: [
          {
            path: "/",
            element: <HomeLayout />,
            children: [
              { path: "", element: <Home /> },
              { path: "guide", element: <Guide /> },
              { path: "account", element: <AccountManagement /> },
              { path: "conveyancing", element: <Conveyancing /> },
            ],
          },
          {
            path: "/create",
            element: <PropertyEditLayout />,
            children: [{ path: "", element: <Create /> }],
          },
          {
            path: "/property/:id",
            element: <PropertyLayout />,
            children: [
              { path: "", element: <Property /> },
              { path: "orders", element: <Orders /> },
            ],
          },
          {
            path: "/property/:id/edit",
            element: <PropertyEditLayout />,
            children: [{ path: "", element: <Edit /> }],
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
