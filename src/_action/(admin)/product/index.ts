"use server";

import { API_ENDPOINT, OK_STATUS_CODE } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";
import { revalidateTag } from "next/cache";

// GET ALL THE PRODUCTS IN THE DATABASE
export async function getProductsServerAction() {
 try {
  const response = await fetch(`${API_ENDPOINT}/products`, {
    method: "GET",
    next: { tags: ["product"] },
  });

  if(!response.ok) return {error: "Failed to fetch the products"};
  
  const data = await response.json();

  return data.data;
 } catch (error) {
  console.error("Something went wrong while fetching the products:", error);
  return {data: []};
 }
}
// DELETE PRODUCT SERVER ACTION
export async function deleteProductServerAction(product_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!product_id) return { error: "Product ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/product/${product_id}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    if (response.status !== OK_STATUS_CODE) return { error: response.statusText };

    revalidateTag("product");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your delete product:", error);
    return { error: "Something went wrong while deleting product" };
  }
}
// RETRIEVE PRODUCT SERVER ACTION
export async function retrieveProductServerAction(product_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!product_id) return { error: "Product ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/product/retrieve/${product_id}`, {
      method: "PUT",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    if (!response.ok) return {error: response.statusText};

    const data = await response.json();

    revalidateTag("product");

    return {success: data.message};
  } catch (error) {
    console.error("Something went wrong while processing your retrieving product:", error);
    return { error: "Something went wrong while retrieving product" };
  }
}
// CREATE PRODUCT SERVER ACTION
export async function createProductServerAction(values: FormData) {
  try {
    const auth_token = await getSessionNextAuth();

    const response = await fetch(`${API_ENDPOINT}/auth/product`, {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: values,
    });



    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Something went wrong while creating product:", error);
    return { error: "Something went wrong while creating product" };
  }
}
