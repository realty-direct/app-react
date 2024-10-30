import { useState } from "react";
import RealtySideBar from "../components/RealtySideBar";
import { Box, Typography } from "@mui/material";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Signin from "./singin";
import Signup from "./signup";
import Home from "./Home";

export default function RootView(): JSX.Element {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <RealtySideBar
          isOpen={isSideBarOpen}
          toggleSidebar={() => setIsSideBarOpen(!isSideBarOpen)}
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
