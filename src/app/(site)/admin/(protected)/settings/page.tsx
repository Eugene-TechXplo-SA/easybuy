import { requireAdmin } from "@/lib/admin/auth";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export default async function SettingsPage() {
  await requireAdmin();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Update your store information.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
