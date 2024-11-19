import type { Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { useLocation } from "react-router-dom";
import { HOME_NAVIGATION, PROPERTY_NAVIGATION } from "./navigation";

export default function ConditionalNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  // Define pages where navigation should be hidden or modified
  const noNavigationPaths = ["/login", "/signup"];
  const minimalNavigationPaths = ["/create"];
  const propertyNavigationPaths = [
    "/property",
    "/orders",
    "/forms",
    "/enquiries",
  ];

  // Helper function to check if a path matches the current location
  const matchesPath = (paths: string[], currentPath: string) =>
    paths.some((path) => currentPath.startsWith(path));

  // Conditionally filter the navigation
  let filteredNavigation: Navigation = [];

  if (matchesPath(noNavigationPaths, location.pathname)) {
    filteredNavigation = []; // Hide navigation for login/signup pages
  } else if (matchesPath(minimalNavigationPaths, location.pathname)) {
    filteredNavigation = [
      { segment: "minimal", title: "Minimal Page", icon: null },
    ]; // Show minimal navigation
  } else if (matchesPath(propertyNavigationPaths, location.pathname)) {
    filteredNavigation = PROPERTY_NAVIGATION; // Show property-specific navigation
  } else {
    filteredNavigation = HOME_NAVIGATION; // Default navigation for other pages
  }

  return <AppProvider navigation={filteredNavigation}>{children}</AppProvider>;
}
