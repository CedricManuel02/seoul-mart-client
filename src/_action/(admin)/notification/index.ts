"use server";
import { API_ENDPOINT } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";

export async function getNotificationsServerAction () {
    const auth_token = await getSessionNextAuth();
    const response = await fetch(`${API_ENDPOINT}/auth/notifications`, {
        method: "GET",
        headers: {
            Cookie: `auth__token=${auth_token}`
        }
    });

    const data = await response.json();

    return data.notifications;
}

export async function markNotificationsAsReadServerAction() {
    const auth_token = await getSessionNextAuth();
    const response = await fetch(`${API_ENDPOINT}/auth/notifications`, {
        method: "PUT",
        headers: {
            Cookie: `auth__token=${auth_token}`
        }
    });

    const data = await response.json();
    
    return data.status;

}