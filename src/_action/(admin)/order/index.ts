"use server"

import { API_ENDPOINT } from "@/_constant/constant";
import { toast } from "@/hooks/use-toast";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getOrdersServerAction() {
    

    const response = await fetch(`${API_ENDPOINT}/auth/orders`, {
        method: "GET",
        headers: {
            "Authorization" : `Bearer `
        }
    });

    const data = await response.json();

    return data.orders;
}

export async function getOrderItemServerAction(payload: {order_id: string}) {
 
    if(!payload.order_id){
      toast({
        title: "Order not found",
        description: "Order Id not found",
      })
    }

    const response = await fetch(`${API_ENDPOINT}/auth/item/order/${payload.order_id}`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer `
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
    `${API_ENDPOINT}/auth/shipped/${payload.order_number}/userID`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer `,
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
