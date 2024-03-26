import { env } from "@/env";
import jose from "jose";
import { cookies } from "next/headers";
import { cache } from "react";

const jwtConfig = {
  secret: new TextEncoder().encode(env.SECRET),
};

export const getSsrUserSession = cache(getUserSession);

export async function getUserSession() {
  const cookie = cookies().get("token");

  try {
    await jose
      .jwtVerify(cookie?.value ?? "", jwtConfig.secret)
      .then((result) => {
        if (result.payload.exp ?? 0 > Math.floor(Date.now() / 1000)) {
          return result.payload;
        }
      });
  } catch (error) {
    return {};
  }
}
