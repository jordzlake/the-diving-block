import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  // Check for session token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
    salt:
      process.env.NODE_ENV === "production"
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
  });
  console.log("token", token);
  if (token) {
    const user = token.user;
    console.log("user", user);
    if (user.isAdmin == true) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(process.env.SITE_URL + "/");
    }
  } else {
    return NextResponse.redirect(process.env.SITE_URL + "/");
  }
}

export const config = {
  matcher: "/admin",
};
