"use server";

import * as jose from "jose";
import { cookies } from "next/headers";
import { env } from "../env";

const jwtConfig = {
  secret: new TextEncoder().encode(env.SECRET),
};

export async function getToken() {
  return cookies().get("token")?.value;
}

export async function isAdmin(): Promise<boolean> {
  const token = cookies().get("token");
  try {
    return await jose
      .jwtVerify(token?.value ?? "", jwtConfig.secret)
      .then((result) => {
        if (result.payload.exp ?? 0 > Math.floor(Date.now() / 1000)) {
          return result.payload.role === "ADMIN";
        }
        return false;
      });
  } catch (error) {
    return false;
  }
}
