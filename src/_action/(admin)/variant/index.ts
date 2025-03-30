"use server";

import { API_ENDPOINT, OK_STATUS_CODE } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";
import { revalidateTag } from "next/cache";

// GET PRODUCT INFO (UPDATE PRODUCT PURPOSE)
export async function getProductServerAction(product_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!product_id) return { error: "Product ID is required" };

    const response = await fetch(`${API_ENDPOINT}/product/${product_id}`, {
      method: "GET",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      next: { tags: ["product"] },
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    if (response.status !== OK_STATUS_CODE) return { error: data.message };

    return data.data;
  } catch (error) {
    console.log("Something went wrong while fetching product:", error);
    return { error: "Something went wrong while fetching product" };
  }
}
// PRODUCT UPDATE / CREATING A VARIANT SERVER ACTION
export async function createVariantServerAction({ product_id, variant_data }: { product_id: string; variant_data: any }) {
  try {
    const auth_token = await getSessionNextAuth();


    const { variant_name, variant_price, variant_image_url, variant_stocks } = variant_data;

    const formData = new FormData();

    if (!product_id) return { error: "Product ID not found" };

    formData.append("variant_name", variant_name);
    formData.append("variant_price", variant_price);
    formData.append("variant_image_url", variant_image_url);
    formData.append("variant_stocks", variant_stocks);

    const response = await fetch(`${API_ENDPOINT}/auth/variant/create/${product_id}`, {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    revalidateTag("product");
    return {success: data.message};
  } catch (error) {
    console.error("Something went wrong while creating variant:", error);
    return { error: "Something went wrong while creating variant" };
  }
}
// DELETING VARIANT SERVER ACTION
export async function deleteVariantServerAction(variant_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!variant_id) return { error: "Variant ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/variant/${variant_id}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) return { error: data.message };

    revalidateTag("product");
    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while deleting vairant:", error);
    return { error: "Something went wrong while deleting vairant" };
  }
}
// RETRIEVING VARIANT SERVER ACTION
export async function retrieveVariantServerAction(variant_id: string) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!variant_id) return { error: "Variant ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/variant/${variant_id}`, {
      method: "PUT",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) return { error: data.message };
    
    revalidateTag("product");
    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while retrieving vairant:", error);
    return { error: "Something went wrong while retrieving vairant" };
  }
}
// UPDATING PRODUCT SERVER ACTION
export async function updateProductServerAction(payload: { product_id: string; product_data: any }) {
  try {
    const auth_token = await getSessionNextAuth();

    const { product_id } = payload;

    const { category_id, product_name, product_upc_number, product_description } = payload.product_data;

    if (!product_id || !category_id || !product_name || !product_upc_number || !product_description) {
      return { error: "All fields are required" };
    }

    const response = await fetch(`${API_ENDPOINT}/auth/product/${product_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `auth__token=${auth_token}`,
      },
      body: JSON.stringify(payload.product_data),
    });

    const data = await response.json();
    if (!response.ok) return { error: data.message };

    revalidateTag("product");

    return data;
  } catch (error) {
    console.error("Something went wrong while updating product:", error);
    return { error: "Something went wrong while updating product" };
  }
}
// UPDATE VARIANT SERVER ACTION
export async function updateVariantServerAction(payload: { variant_id: string; variant_data: any }) {
  try {
    const auth_token = await getSessionNextAuth();

    const { variant_id } = payload;
    const { variant_name, variant_price, variant_stocks, variant_image_url } = payload.variant_data;

    const formData = new FormData();

    if (!variant_id || !variant_name || !variant_price || !variant_stocks) return {error: "All fields are required"};

    if (variant_image_url) {
      formData.append("variant_image_url", variant_image_url);
    }

    formData.append("variant_name", variant_name);
    formData.append("variant_price", variant_price);
    formData.append("variant_stocks", variant_stocks);

    const response = await fetch(`${API_ENDPOINT}/auth/variant/update/${variant_id}`, {
      method: "PUT",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) return { error: data.message };

    revalidateTag("product");
    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while updating variant:", error);
    return { error: "Something went wrong while updating variant" };
  }
}
