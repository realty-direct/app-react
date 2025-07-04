import { Box, Button, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { checkUserSession } from "../database/auth";

export default function Confirm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // This useEffect is necessary because we're performing an async operation
  // with side effects (checking user session and updating state)
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = await checkUserSession();

        if (user) {
          setShowModal(true);
        } else {
          setError("Your email is not confirmed. Please check your inbox.");
        }
      } catch (err) {
        setError("Failed to verify your account. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white w-full">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold">Confirming your email...</h2>
        {loading && <p className="text-gray-500">Checking your status...</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* MUI Confirmation Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            Email Confirmed!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            You have successfully confirmed your email. Please log in.
          </Typography>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/signin")}
            >
              Go to Login
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
