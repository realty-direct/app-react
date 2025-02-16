import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";
import SidebarFooterAccountPopover from "./SideBarFooterAccount";

export default function PropertyLayout() {
  return (
    <DashboardLayout
      slots={{
        toolbarAccount: () => null,
        sidebarFooter: SidebarFooterAccountPopover,
      }}
    >
      {/* <PageContainer breadcrumbs={[]} title=""> */}
      <Outlet />
      {/* </PageContainer> */}
    </DashboardLayout>
  );
}
