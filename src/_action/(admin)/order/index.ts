"use server"

import { API_ENDPOINT } from "@/_constant/constant";
import { toast } from "@/hooks/use-toast";
import { getSessionNextAuth } from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function getOrdersServerAction() {
    const auth_token = await getSessionNextAuth();
    const response = await fetch(`${API_ENDPOINT}/auth/orders`, {
        method: "GET",
        headers: {
            Cookie: `auth__token=${auth_token}`
        }
    });

    const data = await response.json();

    return data.orders;
}

export async function getOrderItemServerAction(payload: {order_id: string}) {
    const auth_token = await getSessionNextAuth();
    if(!payload.order_id){
      toast({
        title: "Order not found",
        description: "Order Id not found",
      })
    }

    const response = await fetch(`${API_ENDPOINT}/auth/item/order/${payload.order_id}`, {
      method: "GET",
      headers: {
          Cookie: `auth__token=${auth_token}`
      }, next: {
      tags: ["order"]
      }
    });
  
    const data = await response.json();
  
    return data.order;
}

export async function createShippedServerAction(payload: {
  order_number: string;
  shipped_details: any;
}) {

  const auth_token = await getSessionNextAuth();
  const formData = new FormData();

  formData.append("delivery_company", payload.shipped_details.delivery_company);
  formData.append(
    "delivery_rider_name",
    payload.shipped_details.delivery_rider_name
  );
  formData.append(
    "delivery_rider_phone",
    payload.shipped_details.delivery_rider_phone
  );
  formData.append(
    "delivery_plate_number",
    payload.shipped_details.delivery_plate_number
  );
  formData.append(
    "delivery_tracking_number",
    payload.shipped_details.tracking_number
  );


  if (payload.shipped_details.item_image) {
    if (Array.isArray(payload.shipped_details.item_image)) {
      payload.shipped_details.item_image.forEach((file: File, index: number) => {
        formData.append(`item_image[${index}]`, file);
      });
    }
  }

  const response = await fetch(
    `${API_ENDPOINT}/auth/shipped/${payload.order_number}`,
    {
      method: "POST",
      headers: {
        Cookie: `auth__token=${auth_token}`,
      },
      body: formData,
    }
  );

  if(!response.ok){
    throw new Error("Error");
  }
  const data = await response.json();

  revalidateTag("order")

  return data;
}
