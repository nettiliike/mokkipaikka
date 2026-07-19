import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({}, { status: 400 });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fi&q=${encodeURIComponent(q)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Mokkipaikka.fi demo" },
      signal: controller.signal,
      next: { revalidate: 86400 },
    });

    if (!response.ok) return NextResponse.json({});
    const data = await response.json();
    if (!data[0]) return NextResponse.json({});

    return NextResponse.json({
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    });
  } catch {
    return NextResponse.json({});
  } finally {
    clearTimeout(timeout);
  }
}
