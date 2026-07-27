import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPages = new Set([
  "/",
  "/about",
  "/blog",
  "/checklists",
  "/checklists/move-in-checklist",
  "/checklists/new-homeowner-checklist",
  "/contact",
  "/disclosure",
  "/editorial-policy",
  "/florida",
  "/florida/driver-vehicle-setup",
  "/florida/emergency-resources",
  "/florida/flood-zones",
  "/florida/hoa-basics",
  "/florida/homestead-exemption",
  "/florida/hurricane-preparation",
  "/florida/moving-to-florida-checklist",
  "/florida/new-florida-homeowner-guide",
  "/florida/seasonal-home-maintenance",
  "/florida/sunpass-toll-roads",
  "/florida/utilities",
  "/florida/wildlife-pests",
  "/homeowners",
  "/homeowners/first-month-checklist",
  "/homeowners/first-week-in-new-home",
  "/homeowners/home-maintenance-checklist",
  "/homeowners/home-safety-checklist",
  "/homeowners/what-to-do-after-buying-a-house",
  "/privacy",
  "/renters",
  "/renters/renter-move-in-checklist",
  "/resources",
  "/terms",
  "/timeline",
  "/timeline/before-move-in",
  "/timeline/first-24-hours",
  "/timeline/first-3-months",
  "/timeline/first-6-months",
  "/timeline/first-month",
  "/timeline/first-week",
  "/timeline/first-year",
  "/timeline/move-in-day",
  "/welcome/florida-welcome",
  "/welcome/new-neighbor",
]);

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.includes(".")) return NextResponse.next();
  if (publicPages.has(request.nextUrl.pathname)) return NextResponse.next();

  const notFoundUrl = request.nextUrl.clone();
  notFoundUrl.pathname = "/route-not-found";
  return NextResponse.rewrite(notFoundUrl, { status: 404 });
}

export const config = {
  matcher: [
    "/:section",
    "/welcome/:path*",
    "/florida/:path*",
    "/homeowners/:path*",
    "/renters/:path*",
    "/checklists/:path*",
    "/timeline/:path*",
  ],
};
