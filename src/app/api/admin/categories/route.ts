import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAdminFromSession } from "@/lib/admin/auth";
import { z } from "zod";

const categorySchema = z.object({
  title: z.string().min(1),
  img: z.string().default(""),
  sort_order: z.number().int().min(0).default(0),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.from("categories").select("*").order("sort_order");
    if (error) throw error;
    return NextResponse.json({ categories: data ?? [] });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    const { data, error } = await supabase.from("categories").insert(parsed.data as never).select().maybeSingle();
    if (error) throw error;
    return NextResponse.json({ category: data }, { status: 201 });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
