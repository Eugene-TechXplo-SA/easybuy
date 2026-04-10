import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
        products (
          id,
          title,
          price,
          discounted_price,
          thumbnail_images,
          preview_images
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = (data ?? []).map((row: any) => ({
      id: row.product_id,
      cartItemId: row.id,
      title: row.products.title,
      price: row.products.price,
      discountedPrice: row.products.discounted_price,
      quantity: row.quantity,
      imgs: {
        thumbnails: row.products.thumbnail_images ?? [],
        previews: row.products.preview_images ?? [],
      },
    }));

    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity = 1 } = body;

    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid productId or quantity" }, { status: 400 });
    }

    const { data: existingRaw } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    const existing = existingRaw as { id: string; quantity: number } | null;

    if (existing) {
      const newQty = existing.quantity + quantity;
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty } as never)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ item: data });
    } else {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id: productId, quantity } as never)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ item: data }, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
