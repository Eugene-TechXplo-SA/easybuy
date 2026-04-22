import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DbUserProfile } from "@/types/database";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ is_admin: false }, { status: 200 });
    }

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle() as { data: Pick<DbUserProfile, "is_admin"> | null };

    return NextResponse.json(
      { is_admin: profile?.is_admin ?? false },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ is_admin: false }, { status: 200 });
  }
}
