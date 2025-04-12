"use server";
import { revalidateTag } from "next/cache";
import { API_ENDPOINT } from "@/_constant/constant";
import { CancelledOrderReason } from "@/_types/enum";
import { getSessionNextAuth } from "@/lib/session";

// ? THIS IS THE CUSTOMER ORDER SERVER ACTION
// * Done Clean Coding

// GET ALL CUSTOMER ORDER SERVER ACTION
export async function getUserOrderServerAction() {
  try {
    const auth_token = await getSessionNextAuth();
 
    const response = await fetch(`${API_ENDPOINT}/auth/order`, {
      method: "GET",
      headers: { Cookie: `auth__token=${auth_token}` },
    });

    if (!response.ok) return { error: "Failed to retrieve your orders" };

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.log("Something went wrong while fetching the orders:", error);
    return { error: "An unexpected error occurred while retrieving the orders." };
  }
}
// GET A SINGLE ORDER IN CUSTOMER SERVER ACTION
export async function getOrderServerAction({ order_id }: { order_id: string }) {
  try {

    const auth_token = await getSessionNextAuth();
 
    if (!order_id) return { error: "Order ID not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/order/${order_id}`, {
      method: "GET",
      headers: { Cookie: `auth__token=${auth_token}` },
      next: { tags: ["order"] },
    });

    if (!response.ok) return { error: "Failed to retrieve order" };

    const data = await response.json();

    return data.order;
  } catch (error) {
    console.log("Something went wrong while fetching the order:", error);
    return { error: "An unexpected error occurred while retrieving the order." };
  }
}
// CUSTOMER RATING ORDER SERVER ACTION
export async function createRatingServerAction({ values, order_id }: { values: any; order_id: string }) {
  try {
    
    const auth_token = await getSessionNextAuth();
    const formData = new FormData();
    const { order_rating, variant_id, order_rating_text, order_rating_image } = values;

    formData.set("variant_id", variant_id);
    formData.set("order_rating", order_rating);
    formData.set("order_rating_text", order_rating_text);

    if (Array.isArray(order_rating_image)) {
      order_rating_image.forEach((file: File, index: number) => {
        formData.append(`order_rating_image[${index}]`, file);
      });
    }

    const response = await fetch(`${API_ENDPOINT}/auth/rating/product/${variant_id}/${order_id}`, {
      method: "POST",
      headers: { Cookie: `auth__token=${auth_token}` },
      body: formData,
    });

    if (!response.ok) return { error: "Failed to submit rating" };

    revalidateTag("order");
    return { success: "Rating submitted successfully"};
  } catch (error) {
    console.error("Something went wrong while processing your rating:", error);
    return {error: "Something went wrong, please try again later"};
  }
}
// CUSTOMER CANCELLED ORDER SERVER ACTION
export async function cancelledOrderServerAction({ reason, order_id }: { reason: CancelledOrderReason; order_id: string }) {
  try {
    const auth_token = await getSessionNextAuth();

    if (!order_id || !reason) return { error: !order_id ? "Order ID not found" : "Reason not found" };

    const response = await fetch(`${API_ENDPOINT}/auth/order/cancelled/${order_id}`, {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    const data = await response.json();
    
    if (response.ok) {
      revalidateTag("order");
      return { success: data.message };
    }

    return { error: data.message || "Failed to cancel order" };
  } catch (error) {
    console.error("Failed while processing the request:", error);
    return { error: "Something went wrong, Please try again later." };
  }
}
// UPDATE CUSTOMER ORDER RECEIVED SERVICE ACTION
export async function receivedOrderServerAction({ order_id }: { order_id: string }) {
  try {
    const auth_token = await getSessionNextAuth();
 
    const response = await fetch(`${API_ENDPOINT}/auth/order/received/${order_id}`, {
      method: "PUT",
      headers: { Cookie: `auth__token=${auth_token}` },
    });

    if (!response.ok) return { error: "Failed to received order, please try again later" };

    revalidateTag("order");
    return { success: "Order status updated successfully" };
  } catch (error) {
    console.error("Something went wrong while processing order received:", error);
    return { error: "An unexpected error occured while processing order received" };
  }
}

export async function deleteOrderServerAction({session_id}: {session_id: string}) {
  try {
    const auth_token = await getSessionNextAuth();
 
    await fetch(`${API_ENDPOINT}/auth/order/delete/${session_id}`, {
      method: "DELETE",
      headers: { Cookie: `auth__token=${auth_token}` },
    });

  } catch (error) {
    console.error("Something went wrong while processing order delete:", error);
    return { error: "An unexpected error occured while processing order delete" };
  }
}

export async function successOrderSeverAction({session_id}: {session_id: string}) {
  try {
    const auth_token = await getSessionNextAuth();
 
    const response = await fetch(`${API_ENDPOINT}/auth/order/success/${session_id}`, {
      method: "GET",
      headers: { Cookie: `auth__token=${auth_token}` },
    });
    const data = await response.json();

    if(!response.ok) return {error: data.message};

    return {success: data.message};

  } catch (error) {
    console.error("Something went wrong while processing order delete:", error);
    return { error: "An unexpected error occured while processing order delete" };
  }
}