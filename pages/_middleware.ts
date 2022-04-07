import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = req.nextUrl.clone();

  const requestKey = url.searchParams.get('key');

  if (
    url.pathname.includes("/api") &&
    url.pathname !== '/api/auth' &&
    url.pathname !== '/api/logout' &&
    !requestKey &&
    requestKey !== process.env.API_ACCESS_KEY
  ) {
    const res = new Response(
      JSON.stringify({
        error: "Not authorized",
      }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );

    return res;
  }
}
