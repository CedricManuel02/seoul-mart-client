"use server"
import { API_ENDPOINT } from "@/_constant/constant";
import { getSessionNextAuth } from "@/lib/session";

export async function getDashboardAnalyticsServerAction() {
    try {
        const auth_token = await getSessionNextAuth();

        const response = await fetch(`${API_ENDPOINT}/auth/dashboard-analytics`, {
            method: "GET",
            headers: {
                Cookie: `auth__token=${auth_token}`
            }
        });


        const data = await response.json();

        if(!response.ok) return {error: data.message}
        
        return data.data;
    } catch (error) {
        console.error("Something went wrong while fetching analytics data:", error);
    }
}

export async function getDashboardBarchartServerAction() {
    try {
        const auth_token = await getSessionNextAuth();

        const response = await fetch(`${API_ENDPOINT}/auth/dashboard-chart`, {
            method: "GET",
            headers: {
                Cookie: `auth__token=${auth_token}`
            }
        });

        const data = await response.json();

        if(!response.ok) return {error: data.message}
        return data.data;
    } catch (error) {
        console.error("Something went wrong while fetching analytics data:", error);
    }
}