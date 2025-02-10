import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Enhancement {
  category: string;
  title: string;
  price: string;
  description: string;
}

const enhancements: Enhancement[] = [
  // PROFESSIONAL SERVICES
  {
    category: "Professional Services",
    title: "Professional Photography and Retouching",
    price: "$350",
    description:
      "First impressions count! Professional photography increases your listing's impact which translates to more views and less time on the market.",
  },
  {
    category: "Professional Services",
    title: "Professional Copywriting",
    price: "$120",
    description:
      "Well-written, compelling copy makes all the difference to your property's campaign. Our expert copywriter crafts unique, memorable content that highlights your property's features.",
  },
  {
    category: "Professional Services",
    title: "Professional 2D full colour Floorplan",
    price: "$120",
    description:
      "Properties with a floorplan average 30% more interest than without one. Allow buyers to visualize your property's layout and picture themselves living there.",
  },
  {
    category: "Professional Services",
    title: "Buyer Negotiations by our Experts",
    price: "$600",
    description:
      "Does negotiation scare you or make you uncomfortable? Our experts can handle buyer negotiations, ensuring you get the best price possible.",
  },
  {
    category: "Professional Services",
    title: "3D Virtual Tours",
    price: "$560",
    description:
      "With a 3D virtual tour, you allow prospective buyers to explore your property online, increasing interest and reducing time on the market.",
  },
  {
    category: "Professional Services",
    title: "Virtual Staging (per image)",
    price: "$45",
    description:
      "If you're listing a vacant property, catch a buyer's interest and remove the cold, empty feeling with professional virtual staging.",
  },

  // SIGNAGE
  {
    category: "Signage",
    title: "Additional professional 'For Sale' Signs",
    price: "$70",
    description:
      "Our 600x900mm professional signs are made of quality corflute and are fully waterproof + UV weather resistant.",
  },
  {
    category: "Signage",
    title: "Triangular Open Home Arrowboard",
    price: "$60",
    description:
      "These arrow boards are an excellent way to draw attention to your open house. Easy to transport and set up.",
  },
  {
    category: "Signage",
    title: "Open for Inspection Sign",
    price: "$60",
    description:
      "Our erasable open for inspection signs are an excellent way to draw attention to your open home.",
  },
  {
    category: "Signage",
    title: "Photographic Sign",
    price: "$269",
    description:
      "Enhance your property's marketing with an eye-popping full-color sign featuring high-quality images.",
  },

  // ENQUIRY HANDLING FEATURES
  {
    category: "Enquiry Handling Features",
    title: "Instant SMS Alerts of all Enquiries in Real-Time",
    price: "$26",
    description:
      "Never miss an enquiry with instant SMS alerts. Receive notifications immediately for all enquiries, whether by phone or email.",
  },
  {
    category: "Enquiry Handling Features",
    title: "Automatic SMS Response to Buyers/Tenants",
    price: "$26",
    description:
      "Ensure buyers receive an immediate response with automated SMS replies. No more missed connections!",
  },
  {
    category: "Enquiry Handling Features",
    title: "Direct Connection of Enquiry Phone Calls",
    price: "$85",
    description:
      "Ensure potential buyers or tenants can reach you instantly. Avoid missed calls with direct call connections.",
  },
  {
    category: "Enquiry Handling Features",
    title: "Full Enquiry System Upgrade: Call Connect plus all SMS",
    price: "$120",
    description:
      "Never miss an enquiry! Get SMS alerts, automatic responses, and call connection all in one package.",
  },

  // CONVEYANCING
  {
    category: "Conveyancing",
    title: "Sale Contract Preparation without Strata",
    price: "$534",
    description:
      "In Victoria, a property cannot be advertised for sale without a contract. We partner with licensed conveyancers to prepare yours.",
  },
  {
    category: "Conveyancing",
    title: "Sale Contract Preparation with Strata",
    price: "$719",
    description:
      "For strata properties, contract preparation requires additional legal checks. We partner with professionals to get it done for you.",
  },

  // EXTRA EXPOSURE
  {
    category: "Extra Exposure",
    title: "50 Glossy Double-Sided Flyers",
    price: "$95",
    description:
      "Stand out with 50 beautifully printed, double-sided flyers that showcase your property's best features.",
  },
  {
    category: "Extra Exposure",
    title: "Social Media Campaign",
    price: "$220",
    description:
      "Expand your audience by advertising your property on social media platforms like Facebook and Instagram.",
  },
  {
    category: "Extra Exposure",
    title: "Listing on Juwai (China)",
    price: "$160",
    description:
      "Reach international buyers! Juwai is China's leading real estate platform, showcasing properties to a global audience.",
  },
  {
    category: "Extra Exposure",
    title: "For Sale Listing on Allhomes.com.au",
    price: "$645",
    description:
      "Get additional exposure on Allhomes, a leading property platform in the ACT region.",
  },

  // REA LISTING UPGRADES
  {
    category: "REA Listing Upgrades",
    title: "30 day Feature Listing Upgrade",
    price: "$1,940",
    description:
      "Feature your property on realestate.com.au for 30 days to attract more buyers.",
  },
  {
    category: "REA Listing Upgrades",
    title: "30 day Highlight Listing Upgrade",
    price: "$3,864",
    description:
      "Highlight your property on realestate.com.au for maximum visibility.",
  },
  {
    category: "REA Listing Upgrades",
    title: "30 day Premiere Listing Upgrade",
    price: "$6,120",
    description:
      "Get top placement on realestate.com.au for 30 days with a Premiere listing.",
  },
];

export default function ListingEnhancements() {
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>(
    []
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Listing Enhancements
      </Typography>

      {Array.from(new Set(enhancements.map((e) => e.category))).map(
        (category) => (
          <Box key={category} sx={{ mt: 3 }}>
            <Typography
              variant="h6"
              sx={{ borderBottom: "1px solid gray", pb: 1, mb: 2 }}
            >
              {category}
            </Typography>

            {enhancements
              .filter((item) => item.category === category)
              .map((item) => (
                <Paper sx={{ p: 2, mb: 2 }} key={item.title}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedEnhancements.includes(item.title)}
                        onChange={() =>
                          setSelectedEnhancements((prev) =>
                            prev.includes(item.title)
                              ? prev.filter((i) => i !== item.title)
                              : [...prev, item.title]
                          )
                        }
                      />
                    }
                    label={`${item.title} - ${item.price}`}
                  />
                </Paper>
              ))}
          </Box>
        )
      )}

      <Button variant="contained" fullWidth>
        Proceed to Checkout ({selectedEnhancements.length} Items)
      </Button>
    </Box>
  );
}
