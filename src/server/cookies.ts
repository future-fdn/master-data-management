"use server";

import { env } from "@/env.js";
import { cookies } from "next/headers";

export async function setUserCookie(jwt: string) {
  cookies().set("token", jwt, {
    httpOnly: env.COOKIE_SECURE,
    maxAge: 60 * 30,
    sameSite: "lax",
    secure: env.COOKIE_SECURE,
  });
}

export async function deleteUserCookie() {
  cookies().delete("token");
}

export async function getToken() {
  const cookie = cookies().get("token");

  return cookie;
}
