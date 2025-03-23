"use client";
import { IOrders } from "@/_interface/interface";
import { formatDate, getRemainingDays } from "@/_utils/helper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Link, Timer, Truck } from "lucide-react";
import React from "react";

export default function OrderHeaderCard({ order }: { order: IOrders }) {
  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      description: "Payment code has been copied to clipboard.",
    });
  }

  return (
    <div className="w-full flex gap-2 py-4 flex-col lg:flex-row">
      <section className="flex-1 bg-white p-4 rounded-md border">
        <Link size={32} className="bg-slate-200 rounded-full p-2" />
        <h3 className="text-slate-700 text-sm font-medium">Payment Code</h3>
        <p className="text-xs text-slate-500">
          Here's the paymongo payment code.
        </p>
        <div className="flex items-center justify-between gap-2">
          <Input
            defaultValue={order.tbl_order_payment.payment_unique_id}
            disabled
          />
          <Button
            onClick={() =>
              copyToClipboard(order.tbl_order_payment.payment_unique_id)
            }
            variant={"outline"}
          >
            <Link size={16} />
          </Button>
        </div>
      </section>
      <div className="flex gap-2 w-full lg:w-80 flex-col sm:flex-row">
        <section className="bg-white w-full p-4 rounded-md border flex justify-between flex-col ">
          <Truck size={32} className="bg-slate-200 rounded-full p-2" />
          <div>
            <h3 className="text-xs text-slate-500 font-medium">
              Estimated Arrival
            </h3>
            <h2 className="text-sm font-medium">
              {formatDate(order.order_target_date_received.toString())}
            </h2>
          </div>
        </section>
        <section className="bg-white w-full p-4 rounded-md border flex flex-col justify-between">
          <Timer size={32} className="bg-slate-200 rounded-full p-2" />
          <div>
            <h3 className="text-xs text-slate-500 font-medium">Delivery in</h3>
            <h2 className="text-sm font-medium">
              {getRemainingDays(order.order_target_date_received.toString())}
            </h2>
          </div>
        </section>
      </div>
    </div>
  );
}
