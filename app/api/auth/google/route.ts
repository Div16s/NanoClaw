import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl, GoogleProvider } from "@/lib/google";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const provider = request.nextUrl.searchParams.get("provider");
  if (!provider || !["gmail", "google_calendar"].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }

  const state = Buffer.from(
    JSON.stringify({ nonce: crypto.randomUUID(), provider }),
  ).toString("base64");

  const cookieStore = await cookies();
  cookieStore.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10,
    path: "/",
    sameSite: "lax",
  });
  const authUrl = getAuthUrl(provider as GoogleProvider, state);

  return NextResponse.redirect(authUrl);
}
