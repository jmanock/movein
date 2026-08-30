export function nextPageView(lastPath: string | null, pathname: string | null | undefined) {
  if (!pathname || pathname === lastPath || !pathname.startsWith("/")) return null;
  return pathname;
}
