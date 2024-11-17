import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const Property = () => {
  // Sample property data
  const property = {
    imageUrl: "https://via.placeholder.com/800x400", // Replace with actual image URL
    address: "123 Main St, Brisbane, QLD",
    type: "Apartment",
    description:
      "A modern two-bedroom apartment located in the heart of Brisbane.",
  };

  // Sample recent orders data
  const recentOrders = [
    {
      id: 101,
      amount: "$1200",
      method: "Credit Card",
      status: "Completed",
      date: "2024-11-01",
    },
    {
      id: 102,
      amount: "$800",
      method: "PayPal",
      status: "Pending",
      date: "2024-11-03",
    },
    {
      id: 103,
      amount: "$500",
      method: "Bank Transfer",
      status: "Cancelled",
      date: "2024-11-05",
    },
    {
      id: 104,
      amount: "$1500",
      method: "Credit Card",
      status: "Completed",
      date: "2024-11-06",
    },
    {
      id: 105,
      amount: "$300",
      method: "PayPal",
      status: "Pending",
      date: "2024-11-08",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      {/* Top Section: Property Details */}
      <Paper
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          padding: 3,
          mb: 4,
          gap: 3,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Property Image */}
        <Box
          component="img"
          src={property.imageUrl}
          alt={`Image of ${property.address}`}
          sx={{
            maxWidth: "100%",
            height: { xs: "200px", md: "300px" },
            objectFit: "cover",
            borderRadius: 2,
            flex: 1,
          }}
        />

        {/* Property Details */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {property.address}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            {property.type}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {property.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Edit Property Details
          </Button>
        </Box>
      </Paper>

      {/* Bottom Section: Recent Orders */}
      <Paper sx={{ boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}>
        <Typography
          variant="h6"
          sx={{
            padding: 2,
            fontWeight: "bold",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #ddd",
          }}
        >
          Recent Orders
        </Typography>
        <TableContainer sx={{ maxHeight: 300, overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Order Number</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Order Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.method}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Property;
