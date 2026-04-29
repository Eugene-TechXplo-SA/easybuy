import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAdminFromSession } from "@/lib/admin/auth";
import { z } from "zod";

const promotionUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  discount_label: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  button_text: z.string().optional(),
  button_link: z.string().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const parsed = promotionUpdateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { data, error } = await supabase.from("promotions").update(parsed.data as never).eq("id", Number(id)).select().maybeSingle();
    if (error) throw error;
    return NextResponse.json({ promotion: data });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const { error } = await supabase.from("promotions").delete().eq("id", Number(id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
