import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAdminFromSession } from "@/lib/admin/auth";
import { z } from "zod";

const settingsSchema = z.object({
  store_name: z.string().min(1).optional(),
  support_phone: z.string().optional(),
  support_email: z.string().optional(),
  store_address: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { data, error } = await supabase.from("site_settings").update({ ...parsed.data, updated_at: new Date().toISOString() } as never).eq("id", 1).select().maybeSingle();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
