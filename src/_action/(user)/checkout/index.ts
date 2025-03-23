"use server";

import { API_ENDPOINT } from "@/_constant/constant";
import { redirect } from "next/navigation";

export async function createCheckoutServerAction(payload: {
  information: any;
  checkout: any;
  location: any;
}) {


  const response = await fetch(
    `${API_ENDPOINT}/auth/checkout/USERID`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer `,
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
