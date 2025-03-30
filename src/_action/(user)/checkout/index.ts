"use server";

import { API_ENDPOINT } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createCheckoutServerAction(payload: {
  information: any;
  checkout: any;
  location: any;
}) {
  const auth_token = await getSessionNextAuth();

  const response = await fetch(
    `${API_ENDPOINT}/auth/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth__token=${auth_token}`,
      },
      body: JSON.stringify({
        information: payload.information,
        checkout: payload.checkout,
        location: payload.location,
      }),
    }
  );

  const data = await response.json();

  redirect(data.checkout_url);
}
