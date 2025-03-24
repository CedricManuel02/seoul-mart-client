"use server";

import { auth, signOut } from "@/auth";

export async function getSessionNextAuth() {
  const session = await auth();
  if (!session || !session.token) {
    await signOut();
    return;
  };

  const auth_token = session.token;
  return auth_token;
}
