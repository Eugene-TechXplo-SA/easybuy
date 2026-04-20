import { requireAdmin } from "@/lib/admin/auth";
import OrdersTable from "@/components/Admin/Orders/OrdersTable";

export default async function AdminOrdersPage() {
  await requireAdmin();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage customer orders.</p>
      </div>
      <OrdersTable />
    </div>
  );
}
