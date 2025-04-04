"use server";

import { API_ENDPOINT } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";
import { revalidateTag } from "next/cache";

// GETTING THE CART SERVER ACTION
export async function getCartServerAction() {
  try {
    const auth_token = await getSessionNextAuth();

    const response = await fetch(`${API_ENDPOINT}/auth/cart`, {
      method: "GET",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      next: { tags: ["cart"] },
    });


    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    return data.cart;
  } catch (error) {
    console.error("Something went wrong while fetching cart:", error);
    return { error: "Something went wrong while fetching cart" };
  }
}
// ADDING PRODUCT TO CART SERVER ACTION
export async function addToCartServerAction(payload: any) {
  try {
    const auth_token = await getSessionNextAuth();

    const response = await fetch(`${API_ENDPOINT}/auth/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth__token=${auth_token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) return { error: data.message};

    revalidateTag("cart");
    return data;
  } catch (error) {
    console.error("Something went wrong while adding product to cart:", error);
    return { error: "Something went wrong while adding product to cart" };
  }
}
// DELETING THE CART SERVER ACTION
export async function deleteCartServerAction(cart_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    const response = await fetch(`${API_ENDPOINT}/auth/cart/${cart_id}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    revalidateTag("cart");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while deleting product to cart:", error);
    return { error: "Something went wrong while deleting product to cart" };
  }
}
// UPDATING THE CART SERVER ACTION
export async function updateCartServerAction(cart_id: string, item_quantity: number, action: string) {
  try {
    const auth_token = await getSessionNextAuth();

    const response = await fetch(`${API_ENDPOINT}/auth/cart/${cart_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth__token=${auth_token}`
      },
      body: JSON.stringify({ item_quantity, action }),
    });

    const data = await response.json();

    if (!response.ok) return {error: data.message}

    revalidateTag("cart");

    return {success: data.message};
  } catch (error) {
    console.error("Something went wrong while updating product to cart:", error);
    return { error: "Something went wrong while updating product to cart" };
  }
}



