import { Box } from "@mui/material";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RealtySideBar from "../components/RealtySideBar";
import Home from "./Home";
import Signup from "./Signup";
import Signin from "./Singin";

export default function RootView(): JSX.Element {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const drawerOptions = ["Home", "Sign In", "Sign Up"];

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <RealtySideBar
          isOpen={isSideBarOpen}
          toggleSidebar={() => setIsSideBarOpen(!isSideBarOpen)}
          drawerOptions={drawerOptions}
        />

        {/* Routed content */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Box>
    </BrowserRouter>
  );
}
