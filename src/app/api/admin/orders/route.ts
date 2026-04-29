import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertAdminFromSession } from "@/lib/admin/auth";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await assertAdminFromSession(supabase);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));
    const status = searchParams.get("status");
    let query = supabase.from("orders").select("*, order_items(*, products(title, thumbnail_images))", { count: "exact" });
    if (status) query = query.eq("status", status);
    query = query.order("created_at", { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1);
    const { data, count, error } = await query;
    if (error) throw error;
    return NextResponse.json({ orders: data ?? [], total: count ?? 0, page, pageSize });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
