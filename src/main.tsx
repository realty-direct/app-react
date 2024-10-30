import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootView from "./routes/RootView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootView />
  </StrictMode>
);
