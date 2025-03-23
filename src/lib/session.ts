"use server";

import { auth } from "@/auth";

export async function getSessionNextAuth() {
  const session = await auth();
  if (!session || !session.token) return;

  const auth_token = session.token;
  return auth_token;
}
