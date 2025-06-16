import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";

import App from "../App";
import "./index.css";
import GuestRoute from "./layouts/GuestRoute";
import HomeLayout from "./layouts/HomeLayout";
import PropertyEditLayout from "./layouts/PropertyEditLayout";
import PropertyLayout from "./layouts/PropertyLayout";
import ProtectedRoute from "./layouts/ProtectedLayout";
import AccountManagement from "./routes/AccountManagement";
import Confirm from "./routes/Confirm";
import Conveyancing from "./routes/Conveyancing";
import Create from "./routes/Create";
import Edit from "./routes/Edit/Edit";
import Enquiries from "./routes/Enquiries";
import Forms from "./routes/Forms";
import Home from "./routes/Home";
import Orders from "./routes/Orders";
import Property from "./routes/Property";
import Signin from "./routes/Signin";
import Signup from "./routes/Signup";
import PaymentSuccess from "./routes/PaymentSuccess";

// Get base path from environment variable
const basePath = import.meta.env.BASE_URL || '/rd-dashboard-react/';

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      // Guest-only routes (redirects to home if authenticated)
      {
        element: <GuestRoute />,
        children: [
          { path: "/signin", element: <Signin /> },
          { path: "/signup", element: <Signup /> },
        ],
      },

      // Public route (accessible to everyone)
      { path: "/confirm", element: <Confirm /> },

      // Protected routes (requires authentication)
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <HomeLayout />,
            children: [
              { path: "", element: <Home /> },
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
              { path: "forms", element: <Forms /> },
              { path: "enquiries", element: <Enquiries /> },
              { path: "payment-success", element: <PaymentSuccess /> },
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
], 
  { basename: basePath }
);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
