import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();
  if (host === "www.movein.guide") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https";
    canonicalUrl.hostname = "movein.guide";
    canonicalUrl.port = "";
    return NextResponse.redirect(canonicalUrl, 308);
  }
  const pathname = request.nextUrl.pathname;
  if (pathname === "/lookup") {
    const zip = request.nextUrl.searchParams.get("zip")?.trim() ?? "";
    if (/^\d{5}$/.test(zip)) {
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.pathname = `/lookup/${zip}`;
      cleanUrl.search = "";
      return NextResponse.redirect(cleanUrl, 308);
    }
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon\.svg|manifest\.webmanifest).*)"] };
