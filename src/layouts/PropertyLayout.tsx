import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function PropertyLayout() {
  return (
    <DashboardLayout>
      {/* <PageContainer breadcrumbs={[]} title=""> */}
      <Outlet />
      {/* </PageContainer> */}
    </DashboardLayout>
  );
}
