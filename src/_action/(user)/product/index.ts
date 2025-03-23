"use server";

import { API_ENDPOINT } from "@/_constant/constant";
export async function getProductServerAction({ product_id }: { product_id: string }) {
  try {

    if (!product_id) return { error: "Product ID not found" };

    const response = await fetch(`${API_ENDPOINT}/product/${product_id}`, {
      method: "GET"
    });

    if (!response.ok) return {error: response.statusText};

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Something went wrong while fetching product:", error);
  }
}
