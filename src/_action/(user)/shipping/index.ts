"use server";

import { API_ENDPOINT } from "@/_constant/constant";
import { redirect } from "next/navigation";

export async function getShippingServerAction(payload: {province_id: string}){


    if(!payload.province_id){
        return new Error("Please provide province id");
    }

 
    const response = await fetch(`${API_ENDPOINT}/auth/shipping/${payload.province_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer `
        }
    });

    const data = await response.json();
    
    return data;

}