import { Box, useTheme } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import Create from "./routes/Create";
import Home from "./routes/Home";
import Property from "./routes/Property";
import Signup from "./routes/Signup";
import Signin from "./routes/Singin";

export default function RootView(): JSX.Element {
  const theme = useTheme();

  const hideSidebarPaths = ["/signin", "/signup", "/create"];
  const location = useLocation();
  const shouldHideSidebar = hideSidebarPaths.some((path) =>
    location.pathname.includes(path)
  );
  const shouldHideHeader = ["/signin", "/signup"].includes(location.pathname);

  return (
    <Box>
      {/* Sidebar appears on larger screens or toggles on small screens */}

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
        <Route path="/create" element={<Create />} />
      </Routes>
    </Box>
  );
}
