import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminAuthResult {
  userId: string;
  firstName: string;
  lastName: string;
}

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/signin");
  }

  if (session.user.app_metadata?.is_admin !== true) {
    redirect("/admin/signin?error=not_admin");
  }

  const meta = session.user.user_metadata ?? {};
  return {
    userId: session.user.id,
    firstName: meta.first_name ?? "",
    lastName: meta.last_name ?? "",
  };
}

export async function assertAdminFromSession(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  if (session.user.app_metadata?.is_admin !== true) return null;
  return session.user;
}
