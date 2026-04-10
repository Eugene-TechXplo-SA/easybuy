import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ itemId: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity } as never)
      .eq("user_id", user.id)
      .eq("product_id", Number(itemId))
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json({ item: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId } = await params;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", Number(itemId));

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
