import { Alert, Box, Button, Paper, Stack, Typography } from "@mui/material";

export default function Conveyancing() {
  const handleRequestCall = () => {
    alert("Your request has been sent. A conveyancer will contact you soon!");
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header Section */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Recommended Conveyancer
      </Typography>

      <Typography
        variant="body1"
        textAlign="center"
        sx={{ color: "text.secondary", mb: 4 }}
      >
        Ensuring a smooth and secure property transaction with our trusted
        conveyancing partner.
      </Typography>

      {/* Main Content */}
      <Paper sx={{ padding: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Why Choose Our Recommended Conveyancer?
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Conveyancing is a crucial legal process when buying or selling a
          property. Our recommended conveyancer specializes in seamless,
          stress-free property transactions with full remote capabilities.
        </Typography>
        {
          // TODO: I like the look of this differentiating severity Alert, but there's something not quite right
        }
        <Stack spacing={2}>
          <Alert severity="success">
            Fully Remote Service – No need for in-person visits, handle
            everything online.
          </Alert>
          <Alert severity="info">
            Experienced & Licensed – Professional team with years of expertise
            in property law.
          </Alert>
          <Alert severity="success">
            Fast & Reliable – Speedy contract reviews and document handling.
          </Alert>
          <Alert icon={undefined} severity="info">
            Transparent Pricing – No hidden fees, upfront cost estimates.
          </Alert>
          <Alert severity="success">
            Customer-Focused – Dedicated support to guide you through every
            step.
          </Alert>
        </Stack>
      </Paper>

      {/* Call to Action */}
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            paddingX: 4,
            paddingY: 1,
          }}
          onClick={handleRequestCall}
        >
          Request a Call
        </Button>
      </Box>
    </Box>
  );
}
