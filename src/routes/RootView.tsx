import { Home as HomeIcon, Login, PersonAdd } from "@mui/icons-material";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/RealtyHeader";
import RealtySideBar from "../components/RealtySideBar";
import Home from "./Home";
import Property from "./Property";
import Signup from "./Signup";
import Signin from "./Singin";

export interface DrawerOptions {
  text: string;
  icon: JSX.Element;
  href: string;
  id: number;
}

export default function RootView(): JSX.Element {
  const drawerOptions = [
    {
      id: 1,
      text: "Properties",
      icon: <HomeIcon color="primary" />,
      href: "/",
    },
    {
      id: 2,
      text: "Sign In",
      icon: <Login color="primary" />,
      href: "/signin",
    },
    {
      id: 3,
      text: "Sign Up",
      icon: <PersonAdd color="primary" />,
      href: "/signup",
    },
  ];
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => setIsSideBarOpen(!isSideBarOpen);

  // Close sidebar on small screens automatically
  useEffect(() => {
    if (isSmallScreen) setIsSideBarOpen(false);
    if (!isSmallScreen) setIsSideBarOpen(true);
  }, [isSmallScreen]);

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Sidebar appears on larger screens or toggles on small screens */}
        <RealtySideBar
          isOpen={isSideBarOpen}
          toggleSidebar={toggleSidebar}
          drawerOptions={drawerOptions}
        />

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Header isSmallScreen={isSmallScreen} toggleSidebar={toggleSidebar} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: "100vh",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "auto",
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/property/:id" element={<Property />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  );
}
