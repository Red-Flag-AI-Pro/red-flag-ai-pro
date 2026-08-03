import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// This project had two separate middleware files since near the start:
// this one (spam-referrer blocking, Nigeria geo pricing cookie) and a
// second one at the project root (Supabase auth redirects). Next.js only
// ever runs one middleware/proxy file, and it was silently picking the
// root one, so the logic below had likely never actually run in
// production. Merged into a single file so nothing gets dropped again.
const SPAM_REFERRERS = [
  "hkt10.orderbeijingbistrobuda.com",
  "applynow.myeduplug.com",
  "travel.dailyschoolgist.com",
];

const PROTECTED_PREFIXES = ["/dashboard", "/scans", "/history", "/billing"];

export async function proxy(request: NextRequest) {
  const referer = request.headers.get("referer") ?? "";
  const isSpam = SPAM_REFERRERS.some((domain) => referer.includes(domain));
  if (isSpam) {
    return new NextResponse(null, { status: 403 });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  const country = request.headers.get("x-vercel-ip-country") ?? "";
  if (country === "NG") {
    supabaseResponse.cookies.set("rfai_geo", "NG", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      httpOnly: false,
    });
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf)$).*)"],
};
