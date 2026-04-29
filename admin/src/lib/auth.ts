import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DbUserProfile } from "@/types/database";

export interface AdminAuthResult {
  userId: string;
  profile: DbUserProfile;
}

export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  // Check JWT app_metadata first — no DB call needed for the gate
  const isAdminFromJwt = user.app_metadata?.is_admin === true;

  if (!isAdminFromJwt) {
    redirect("/signin?error=not_admin");
  }

  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!data) {
    redirect("/signin");
  }

  return { userId: user.id, profile: data as DbUserProfile };
}
