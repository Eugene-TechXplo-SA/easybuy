import { requireAdmin } from "@/lib/admin/auth";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";

export const metadata = {
  title: "Admin Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader firstName={profile.first_name} lastName={profile.last_name} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
