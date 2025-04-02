"use server";

import { SignoutServerAction } from "@/_action/(shared)/login";
import { auth, signOut } from "@/auth";

export async function getSessionNextAuth() {
  try {
    const session = await auth();

    if (!session || !session.token) {
      await signOut();
      return;
    };

    const expires_at = new Date(session.expires);
    const date_now = new Date(Date.now());

    if(date_now > expires_at) {
     return await Promise.all([signOut, SignoutServerAction]);
    }
  
    const auth_token = session.token;
    return auth_token;
  } catch (error) {
    return;
  }
}
