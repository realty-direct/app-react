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

  useEffect(() => {
    if (isSmallScreen) setIsSideBarOpen(false);
  }, [isSmallScreen]);

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header isSmallScreen={isSmallScreen} toggleSidebar={toggleSidebar} />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
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
      </Box>
    </BrowserRouter>
  );
}
