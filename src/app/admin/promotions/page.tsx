import { requireAdmin } from "@/lib/admin/auth";
import PromotionsTable from "@/components/Admin/Promotions/PromotionsTable";

export default async function AdminPromotionsPage() {
  await requireAdmin();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Promotions</h1>
        <p className="mt-1 text-sm text-gray-500">Create and manage promotional banners.</p>
      </div>
      <PromotionsTable />
    </div>
  );
}
