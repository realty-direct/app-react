import {
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  Lightbulb,
  Mail,
} from "@mui/icons-material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import type { Navigation } from "@toolpad/core/AppProvider";

// TODO: Need to add the email of the logged in user at button
// TODO: Need to add the logout button
// TODO: Need to add the add property button

export const HOME_NAVIGATION: Navigation = [
  { segment: "guide", title: "Guide to Selling", icon: <Lightbulb /> },
  { segment: "edit", title: "Edit Account", icon: <Edit /> },
  { segment: "conveyancer", title: "Recommended Conveyancer", icon: <Gavel /> },
];

export const PROPERTY_NAVIGATION: Navigation = [
  { segment: "", title: "Back to Dashboard", icon: <KeyboardReturnIcon /> },

  {
    kind: "divider",
  },
  { segment: "/property", title: "Overview", icon: <Dashboard /> },
  { segment: "orders", title: "Orders", icon: <ShoppingCartIcon /> },
  { segment: "forms", title: "Forms & Downloads", icon: <Description /> },
  { segment: "enquiries", title: "Enquiries", icon: <Mail /> },
  { segment: "delete", title: "Delete Property", icon: <Delete /> },
];
