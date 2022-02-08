import { Outlet } from "remix";
import DashboardNavbar from "~/components/dashboard/navbar";
import DashboardSidebar from "~/components/dashboard/sidebar";

export default function Dashboard() {
  return (
    <main className="w-screen h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex grow">
        <DashboardSidebar />
        <div className="p-4 w-full">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
