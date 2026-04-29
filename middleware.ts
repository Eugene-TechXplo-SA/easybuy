import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const USER_PROTECTED = ["/checkout", "/my-account", "/wishlist", "/cart"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // Admin routes — protect everything under /admin except /admin/signin
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/signin")) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }

    if (session.user.app_metadata?.is_admin !== true) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/signin";
      url.searchParams.set("error", "not_admin");
      return NextResponse.redirect(url);
    }

    return response;
  }

  // Customer-protected routes
  const isUserProtected = USER_PROTECTED.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isUserProtected) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/signin";
      redirectUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout",
    "/checkout/:path*",
    "/my-account",
    "/my-account/:path*",
    "/wishlist",
    "/wishlist/:path*",
    "/cart",
    "/cart/:path*",
  ],
};
