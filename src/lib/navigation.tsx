import {
  ArrowBack,
  Dashboard,
  Delete,
  Description,
  Gavel,
  House,
  Mail,
  Person,
  ShoppingCart,
} from "@mui/icons-material";
import type { Navigation, NavigationItem } from "@toolpad/core";
import { useLocation, useParams } from "react-router";

export const HOME_NAVIGATION: NavigationItem[] = [
  { segment: "", title: "Your Properties", icon: <House /> },
  {
    segment: "conveyancing",
    title: "Recommended Conveyancer",
    icon: <Gavel />,
  },
  { kind: "divider" },
  {
    segment: "account",
    title: "Account Management",
    icon: <Person />,
  },
];

export function useNavigationConfig() {
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); // ✅ Get `id` from URL

  const PROPERTY_NAVIGATION: Navigation = id
    ? [
        {
          segment: ".",
          title: "Return to dashboard",
          icon: <ArrowBack />,
        },
        { kind: "divider" },
        {
          segment: `property/${id}`,
          title: "Overview",
          icon: <Dashboard />,
        },
        {
          segment: `property/${id}/orders`,
          title: "Orders",
          icon: <ShoppingCart />,
        },
        {
          segment: `property/${id}/forms`,
          title: "Forms & Downloads",
          icon: <Description />,
        },
        {
          segment: `property/${id}/enquiries`,
          title: "Enquiries",
          icon: <Mail />,
        },
        {
          segment: `property/${id}/delete`,
          title: "Delete Property",
          icon: <Delete />,
        },
      ]
    : [];

  const isEditOrCreatePath =
    location.pathname.includes("/create") ||
    location.pathname.includes("/edit");

  const navigationToUse = location.pathname.startsWith("/property")
    ? PROPERTY_NAVIGATION
    : HOME_NAVIGATION;

  return { isEditOrCreatePath, navigationToUse };
}
