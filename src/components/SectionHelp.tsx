import { Box, Typography } from "@mui/material";

interface SectionHelpProps {
  sectionIndex: number;
}

const sectionHelpContent: Record<number, string> = {
  0: "Enter key property details such as property type, land size, number of rooms, and construction year. These details help buyers find your property when filtering their search.",
  1: "Highlight your property's unique features like air conditioning, solar panels, or recent renovations. Choose from common features or add custom ones to make your listing stand out.",
  2: "Set your asking price and choose how it's displayed. You can show an exact price, a price range, or use 'Contact Agent'. Consider recent sales in your area when setting the price.",
  3: "Professional photos significantly increase buyer interest. Upload high-quality images of your property's exterior, interior rooms, and special features. Add floor plans and virtual tours if available.",
  4: "Upload your rates notice and photo ID to verify your ownership. This verification helps build trust with potential buyers and is required before your listing goes live.",
  5: "Write a compelling description that tells your property's story. Focus on unique features, recent improvements, and lifestyle benefits. Include keywords buyers might search for.",
  6: "Add your preferred contact methods and times. You can choose to display your phone number, email, or handle all inquiries through the platform's messaging system.",
  7: "Schedule open house inspections and set your availability for private viewings. Well-planned inspection times can help attract more potential buyers.",
  8: "Compare different listing packages and their features. Each package offers different levels of exposure and marketing tools to help sell your property.",
  9: "Boost your listing's visibility with premium placements, featured status, or professional photography services. These enhancements can help your property stand out in search results.",
  10: "Review all your listing details before going live. Check that all information is accurate and complete, and preview how your listing will appear to potential buyers.",
};

export default function SectionHelp({ sectionIndex }: SectionHelpProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 2,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.8)' : 'background.paper',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? theme.palette.divider : 'transparent'}`,
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{
          color: (theme) => theme.palette.primary.main,
          fontWeight: 'bold',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          pb: 1,
        }}
      >
        Section Help
      </Typography>

      {sectionHelpContent[sectionIndex] && (
        <Typography 
          variant="body2" 
          color="text.primary"
          sx={{ mt: 2 }}
        >
          {sectionHelpContent[sectionIndex]}
        </Typography>
      )}
    </Box>
  );
}