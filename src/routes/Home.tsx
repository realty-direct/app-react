import { Box, Card, CardContent, Link, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Home(): JSX.Element {
  const properties = [
    { id: 1, name: "Property 1", price: 100000, location: "Location 1" },
    { id: 2, name: "Property 2", price: 200000, location: "Location 2" },
    { id: 3, name: "Property 3", price: 300000, location: "Location 3" },
  ];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        height: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" className="text-4xl font-bold text-slate-600">
        Properties
      </Typography>

      <Grid container spacing={3} mt={4} justifyContent="center">
        {properties.map((property) => (
          <Link key={property.id} href={`/property/${property.id}`}>
            <Card key={property.id}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {property.name}
                </Typography>
                <Typography variant="body1">
                  Price: ${property.price}
                </Typography>
                <Typography variant="body2">
                  Location: {property.location}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}
