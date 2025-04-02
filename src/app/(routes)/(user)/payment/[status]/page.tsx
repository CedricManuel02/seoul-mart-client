"use client";
import { deleteOrderServerAction } from "@/_action/(user)/order";
import { clearSelectedItems } from "@/_redux/features/cart-slice";
import { clearCheckoutItem } from "@/_redux/features/checkout-slice";
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Payment() {
  const { status } = useParams();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearSelectedItems());
    dispatch(clearCheckoutItem());
  }, []);

  useEffect(() => {
    try {
      async function deleteOrder(session_id: string) {
        await deleteOrderServerAction({ session_id });
      }
      if (status?.toString().toLowerCase() === "cancel" && session_id) {
        deleteOrder(session_id);
      }
    } catch (error) {
      console.error("Something went wrong while processing the cancelled order:", error);
    }
  }, [session_id]);
  return (
    <div className="w-full min-h-screen h-auto flex flex-col gap-4 items-center justify-center px-4">
      {status === "success" ? <CircleCheck className="text-green-500" size={40} /> : <CircleX className="text-red-500" size={40} />}
      <h3 className="text-slate-700 font-semibold text-lg sm:text-2xl">{status === "success" ? "Payment Successful!" : "Payment Failed!"}</h3>
      <p className="text-slate-500 text-center text-xs sm:text-sm">
        {status === "success"
          ? "We will be sending you an email confirmation to bellaandpepper@gmail.com."
          : "Your transaction has failed due to some technical error. Please try again."}
      </p>
      <Button className="w-full lg:w-96 bg-green-500 hover:bg-green-700">Continue Shopping</Button>
    </div>
  );
}
