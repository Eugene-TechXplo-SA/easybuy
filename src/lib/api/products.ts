import type { ProductsResponse, ApiProduct, ApiCategory } from "@/types/product";

export async function fetchProducts(params: {
  category?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  search?: string;
  page?: number;
  pageSize?: number;
  filter?: "new_arrivals" | "best_sellers" | "featured" | null;
} = {}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", String(params.category));
  if (params.minPrice != null) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) query.set("maxPrice", String(params.maxPrice));
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.filter) query.set("filter", params.filter);

  const res = await fetch(`/api/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<ApiProduct | null> {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  const data = await res.json();
  return data.product;
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch("/api/categories", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}
