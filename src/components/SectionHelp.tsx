import { Box, Typography } from "@mui/material";

interface SectionHelpProps {
  sectionIndex: number;
}

const sectionHelpContent: Record<number, string> = {
  0: "Start by entering the basic details about your property including size and type.",
  1: "Add key features of your property such as the number of bedrooms, bathrooms, and parking spaces.",
  2: "Set your property's price and any price display preferences.",
  3: "Upload high-quality images to make your listing stand out. The first image will be your main display image.",
  4: "Verify your ownership of the property to ensure listing authenticity.",
  5: "Write a compelling description that highlights your property's best features.",
  6: "Provide contact details for potential buyers to reach you.",
  7: "Set up open house and private inspection times.",
  8: "Choose a package that fits your needs and budget. Each package offers different features.",
  9: "Select additional enhancements to boost your listing's visibility.",
  10: "Review your listing details before finalizing.",
};

export default function SectionHelp({ sectionIndex }: SectionHelpProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Section Help
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Complete each section to create your property listing. The more detailed
        information you provide, the better your listing will perform.
      </Typography>

      {sectionHelpContent[sectionIndex] && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {sectionHelpContent[sectionIndex]}
        </Typography>
      )}
    </Box>
  );
}
