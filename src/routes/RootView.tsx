import { useState } from "react";
import RealtySideBar from "../components/RealtySideBar";
import { Box, Typography } from "@mui/material";

export default function RootView(): JSX.Element {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <RealtySideBar
        isOpen={isSideBarOpen}
        toggleSidebar={() => setIsSideBarOpen(!isSideBarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc", // light Tailwind color
        }}
      >
        <Typography variant="h1" className="text-4xl font-bold text-slate-600">
          Vite + React
        </Typography>
        <Typography variant="body1" className="mt-4 text-lg text-slate-800">
          Click on the Vite and React logos to learn more
        </Typography>
      </Box>
    </Box>
  );
}
