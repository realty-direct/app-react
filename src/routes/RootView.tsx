import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/RealtyHeader";
import RealtySideBar from "../components/RealtySideBar";
import Home from "./Home";
import Signup from "./Signup";
import Signin from "./Singin";

export default function RootView(): JSX.Element {
  const drawerOptions = ["Home", "Sign In", "Sign Up"];
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => setIsSideBarOpen(!isSideBarOpen);

  // Close sidebar on small screens
  useEffect(() => {
    if (isSmallScreen) setIsSideBarOpen(false);
  }, [isSmallScreen]);

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar should only appear on larger screens */}
        {!isSmallScreen && (
          <RealtySideBar
            isOpen={isSideBarOpen || !isSmallScreen}
            toggleSidebar={toggleSidebar}
            drawerOptions={drawerOptions}
          />
        )}

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Header isSmallScreen={isSmallScreen} toggleSidebar={toggleSidebar} />

          {/* Main content area */}
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
