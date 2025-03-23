"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function PurchaseButton({ order_id }: { order_id: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-end">
      <Button
        onClick={() => router.push(`/purchase/item/${order_id}`)}
        variant={"outline"}
        className="text-green-500 border-green-500 hover:text-green-700 hover:bg-transparent hover:border-green-700"
      >
        View Order
      </Button>
    </div>
  );
}
