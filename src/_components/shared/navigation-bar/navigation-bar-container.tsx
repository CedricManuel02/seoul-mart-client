"use client"
import { getAccountServerAction } from "@/_action/(shared)/login";
import React, { useEffect } from "react";

export default function NavigationBarContainer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const getAccount = async () => {
        await getAccountServerAction();
      }
      getAccount();
    } catch (error) {
      console.error("Something went wrong while fetching account:", error);
    }
  }, []);
  return <div className="flex items-center space-x-6">{children}</div>;
}
