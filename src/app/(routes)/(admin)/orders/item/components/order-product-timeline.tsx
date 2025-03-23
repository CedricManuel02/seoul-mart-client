import { IOrders } from "@/_interface/interface";
import { formatDateWithTime } from "@/_utils/helper";
import { Check } from "lucide-react";
import React from "react";
import OrderProductShippedModal from "./order-product-shipped-modal";

export default function OrderProductTimeline({ order }: { order: IOrders }) {
  return (
    <section className="border rounded p-4 w-full">
      <h3 className="text-slate-500 text-xs font-medium">Timeline</h3>
      <ul className="flex flex-col gap-4 py-4">
        {order.tbl_order_status
          .sort(
            (a: any, b: any) =>
              new Date(b.order_status_date_created).getTime() -
              new Date(a.order_status_date_created).getTime()
          )
          .map((status: any, index: number) => (
            <li
              className={`${index === 0 ? "opacity-100" : "opacity-75"}`}
              key={status.order_status_id}
            >
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <div className="flex flex-col">
                  <h3 className="text-slate-700 text-sm font-medium">
                    {status.tbl_status.status_name}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    {formatDateWithTime(status.order_status_date_created)}
                  </p>
                  {status.tbl_order_status_images.length > 0 && (
                    <OrderProductShippedModal order={order}/>
                  )}
                </div>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
