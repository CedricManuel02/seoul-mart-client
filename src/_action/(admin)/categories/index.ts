"use server";
import { API_ENDPOINT, CREATED_STATUS_CODE, OK_STATUS_CODE } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//? DONE CODE CLEAN UP

// GET ALL CATEGORIES SERVER ACTION
export async function getCategoriesServerAction() {
  try {
    const response = await fetch(`${API_ENDPOINT}/categories`, {
      method: "GET",
      next: { tags: ["categories"] },
    });

    if (!response.ok) return { data: [] };

    const data = await response.json();

    return data.category;
  } catch (error) {
    console.error("Something went wrong while fetching the categories:", error);
    return { data: [] };
  }
}
// CREATE CATEGORIES SERVER ACTION
export async function createCategoryServerAction(values: any) {
  try {
    const auth_token = await getSessionNextAuth();
    const formData = new FormData();

    formData.set("category_name", values.category_name);
    formData.set("category_image", values.category_image);

    const response = await fetch(`${API_ENDPOINT}/auth/categories`, {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: formData,
    });

    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    if (data.status !== CREATED_STATUS_CODE) return { error: data.message };

    revalidateTag("categories");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while creating category:", error);
    return { error: "Something went wrong while creating category" };
  }
}
// DELETE CATEGORIES SERVER ACTION
export async function deleteCategoryServerAction({ category_id }: { category_id: string }) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!category_id) return { error: "Category ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/categories/${category_id}`, {
      method: "DELETE",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    if (response.status !== OK_STATUS_CODE) return { error: response.statusText };

    revalidateTag("categories");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your delete category:", error);
    return { error: "Something went wrong while deleting category" };
  }
}
// RETRIEVE THE CATEGORY SERVER ACTION
export async function retrieveCategoryServerAction({ category_id }: { category_id: string }) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!category_id) return { error: "Category ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/categories/${category_id}`, {
      method: "PUT",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
    });

    if (!response.ok) return { error: response.statusText };

    const data = await response.json();

    revalidateTag("categories");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your retrieving category:", error);
    return { error: "Something went wrong while retrieving category" };
  }
}
// UPDATE CATEGORIES SERVER ACTION
export async function updateCategoryServerAction(values: any) {
  try {
    const auth_token = await getSessionNextAuth();

    const { category_id, category_name, category_image } = values;

    if (!category_id || !category_name) return { error: "All fields are required" };

    const formData = new FormData();

    formData.set("category_id", category_id);
    formData.set("category_name", category_name);

    if (category_image) {
      formData.set("category_image", category_image);
    }

    const response = await fetch(`${API_ENDPOINT}/auth/categories/update/${category_id}`, {
      method: "PUT",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: formData,
    });

    if (!response.ok) return { error: response.statusText };

    if (response.status !== OK_STATUS_CODE) return { error: response.statusText };

    const data = await response.json();

    revalidateTag("categories");

    return { success: data.message };
  } catch (error) {
    console.error("Something went wrong while processing your updating category:", error);
    return { error: "Something went wrong while updating category" };
  }
}
