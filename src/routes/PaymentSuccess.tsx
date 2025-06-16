import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePropertyDetailInDB } from "../database/details";
import LoadingSpinner from "../components/LoadingSpinner";
import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useRealtyStore from "../store/store";

export default function PaymentSuccess() {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!propertyId) return;

      try {
        await updatePropertyDetailInDB(propertyId, {
          payment_status: "completed",
          payment_date: new Date().toISOString().split("T")[0],
          listing_status: "active",
        });

        // Update local store
        const { updatePropertyDetail } = useRealtyStore.getState();
        updatePropertyDetail(propertyId, {
          payment_status: "completed",
          payment_date: new Date().toISOString().split("T")[0],
          listing_status: "active",
        });
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    };

    updatePaymentStatus();
  }, [propertyId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        p: 3,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
      <Typography variant="h4" gutterBottom>
        Payment Successful!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
        Your property listing is now active and will be visible to potential buyers.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(`/property/${propertyId}`)}
      >
        View Property Dashboard
      </Button>
    </Box>
  );
}