import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAdminFromSession } from "@/lib/admin/auth";
import { z } from "zod";

const orderUpdateSchema = z.object({
  status: z.enum(["pending", "processing", "on-hold", "shipped", "delivered", "cancelled"]),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const parsed = orderUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { data, error } = await supabase.from("orders").update({ status: parsed.data.status, updated_at: new Date().toISOString() } as never).eq("id", id).select().maybeSingle();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
