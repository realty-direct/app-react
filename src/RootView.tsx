import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/RealtyHeader";
import RealtySideBar from "./components/SideBar/RealtySideBar";
import Home from "./routes/Home";
import Property from "./routes/Property";
import Signup from "./routes/Signup";
import Signin from "./routes/Singin";

export default function RootView(): JSX.Element {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => setIsSideBarOpen(!isSideBarOpen);

  // Close sidebar on small screens automatically
  useEffect(() => {
    if (isSmallScreen) setIsSideBarOpen(false);
    if (!isSmallScreen) setIsSideBarOpen(true);
  }, [isSmallScreen]);

  const hideSidebarPaths = ["/signin", "/signup", "/create"];
  const location = useLocation();
  const shouldHideSidebar = hideSidebarPaths.some((path) =>
    location.pathname.includes(path)
  );
  const shouldHideHeader = ["/signin", "/signup"].includes(location.pathname);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar appears on larger screens or toggles on small screens */}
      {!shouldHideSidebar && (
        <RealtySideBar isOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />
      )}

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {!shouldHideHeader && (
          <Header isSmallScreen={isSmallScreen} toggleSidebar={toggleSidebar} />
        )}

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
            <Route path="/property/:id" element={<Property />}>
              {/* <Route path="orders" element={<OrderHistory />} /> */}
              {/* <Route path="forms" element={<FormsDownloads />} /> */}
              {/* <Route path="enquiries" element={<Enquiries />} /> */}
              {/* <Route path="delete" element={<DeleteProperty />} /> */}
            </Route>
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
