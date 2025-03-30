import { IOrders } from "@/_interface/interface";
import { calculateProductTotal, formatCurrency, formatTransactionFee } from "@/_utils/helper";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";



export default async function OrderProductSummary({order,}: {order: IOrders;}) {
  const { total, totalItems } = await calculateProductTotal(order);

  return (
    <div className="h-auto flex flex-col items-between justify-center gap-4 p-4 border rounded">
      <div className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-slate-700 text-sm font-medium">Order Summary</h3>
          <p className="text-xs text-slate-500">
            Here's the summary for the stuff customer bought.
          </p>
        </div>
        {order.tbl_order_payment.payment_status === "PAID" && (
          <p className="text-xs w-32 text-center font-medium text-green-500 bg-green-100 rounded-full px-2 py-1">
            Payment Success
          </p>
        )}
      </div>
      <div className="w-full flex items-center justify-between">
        <h4 className="text-sm ">Subtotal</h4>
        <p className="font-medium text-sm text-slate-700">
          {formatCurrency(totalItems)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <h4 className="text-sm ">Shipping Fee</h4>
        <p className="font-medium text-sm text-slate-700">
          {formatCurrency(order.order_shipping_fee)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <h4 className="text-sm ">Transaction Fee</h4>
        <p className="font-medium text-sm text-slate-700">
          {formatTransactionFee(order.tbl_order_payment.payment_transaction_fee)}
        </p>
      </div>
      <div className="w-full flex items-center justify-between">
        <h4 className="text-sm ">Mode of Payment</h4>
        <p className="font-medium text-sm text-slate-700">
          {order.tbl_order_payment.payment_method === "card" && (<Image src={"https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png"} className="rounded object-cover" alt="card" loading="lazy" width={40} height={40}/>)}
        </p>
      </div>
      <Separator orientation="horizontal" />
      <div className="text-slate-700 text-md font-semibold w-full flex items-center justify-between">
        <h4>Total</h4>
        <p>{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
