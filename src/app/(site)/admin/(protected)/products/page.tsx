import { requireAdmin } from "@/lib/admin/auth";
import ProductsTable from "@/components/admin/products/ProductsTable";

export default async function ProductsPage() {
  await requireAdmin();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your product catalogue.</p>
      </div>
      <ProductsTable />
    </div>
  );
}
