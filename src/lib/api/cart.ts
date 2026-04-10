export type CartItemPayload = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: { thumbnails: string[]; previews: string[] };
};

export async function apiGetCart(): Promise<CartItemPayload[]> {
  const res = await fetch("/api/cart", { cache: "no-store" });
  if (!res.ok) return [];
  const { items } = await res.json();
  return items ?? [];
}

export async function apiAddToCart(productId: number, quantity: number): Promise<void> {
  await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function apiUpdateCartItem(productId: number, quantity: number): Promise<void> {
  await fetch(`/api/cart/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity }),
  });
}

export async function apiRemoveCartItem(productId: number): Promise<void> {
  await fetch(`/api/cart/${productId}`, { method: "DELETE" });
}

export async function apiClearCart(): Promise<void> {
  await fetch("/api/cart", { method: "DELETE" });
}
