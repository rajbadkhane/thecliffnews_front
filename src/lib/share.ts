export function appendShareSource(url: string) {
  const parsedUrl = new URL(url, window.location.origin);
  parsedUrl.searchParams.set("source", "share");

  return parsedUrl.toString();
}
