import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/first-login"],
};
