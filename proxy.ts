import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { supportedPilotZips } from "./app/data/site";

const supported = new Set<string>(supportedPilotZips);

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/lookup") return NextResponse.next();
  const match = pathname.match(/^\/lookup\/([^/]+)\/?$/);
  if (match && supported.has(match[1])) return NextResponse.next();
  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/route-not-found";
  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = { matcher: ["/lookup/:path*"] };
