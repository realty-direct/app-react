import { Box } from "@mui/material";
import type { JSX } from "react";
import { Route, Routes } from "react-router-dom";
import Create from "./routes/Create";
import Home from "./routes/Home";
import Property from "./routes/Property";
import Signup from "./routes/Signup";
import Signin from "./routes/Singin";

export default function RootView(): JSX.Element {
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
