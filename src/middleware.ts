import { isAdmin } from "@/actions/cookies";
import { env } from "@/env";
import {
  DEFAULT_LOGIN_REDIRECT,
  adminRoutes,
  apiPrefix,
  authRoutes,
  publicRoutes,
} from "@/server/routes";
import * as jose from "jose";
import { NextRequest } from "next/server";

const jwtConfig = {
  secret: new TextEncoder().encode(env.SECRET),
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  let isLoggedIn = false;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  const cookie = req.cookies.get("token");

  try {
    await jose
      .jwtVerify(cookie?.value ?? "", jwtConfig.secret)
      .then((result) => {
        if (result.payload.exp ?? 0 > Math.floor(Date.now() / 1000)) {
          isLoggedIn = true;
        }
      });
  } catch (error) {
    isLoggedIn = false;
  }

  if (!(await isAdmin()) && isAdminRoute) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(`/auth/login`, nextUrl));
  }
}

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
