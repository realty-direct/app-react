import { DashboardLayout, PageContainer } from "@toolpad/core";
import { useLocation } from "react-router-dom";
import MinimalLayout from "./src/MinimalLayout";
import RootView from "./src/RootView";

export default function App(): JSX.Element {
  const location = useLocation();

  // Define pages where header and sidebar should be hidden
  const minimalLayoutPaths = ["/signin", "/signup"];

  const useMinimalLayout = minimalLayoutPaths.includes(location.pathname);

  return useMinimalLayout ? (
    <MinimalLayout>
      <RootView />
    </MinimalLayout>
  ) : (
    <DashboardLayout>
      <PageContainer>
        <RootView />
      </PageContainer>
    </DashboardLayout>
  );
}
