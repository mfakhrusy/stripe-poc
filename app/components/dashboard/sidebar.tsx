import { Link } from "remix";

export default function DashboardSidebar() {
  return (
    <nav
      className="flex flex-col w-48 h-full pt-4"
      style={{ background: "#8360c355" }}
    >
      <Link to="/dashboard/order" className="text-black mb-2 px-4">
        Current Orders
      </Link>
      <Link to="/dashboard/order/new" className="text-black px-4">
        New Order
      </Link>
    </nav>
  );
}
