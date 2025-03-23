import { IItems, IOrders } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";
import React from "react";

export default function OrderProductList({ order }: { order: IOrders }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
      {order.tbl_items.map((item: IItems) => (
        <figcaption
          className="flex space-x-4 border p-2 rounded w-full"
          key={item.item_id}
        >
          <figure>
            <Image
              className="shadow p-2 rounded object-contain"
              src={item.item_product_image}
              alt={item.item_variant_name}
              height={80}
              width={80}
            />
          </figure>
          <section className="w-full flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-medium text-sm text-slate-700">
                {item.item_product_name}
              </h3>
              <span className="font-medium text-xs text-slate-500 flex items-center space-x-2">
                <p>{item.item_product_variant}</p>
                <Separator className="h-4" orientation={"vertical"} />
                <p>x {item.item_quantity}</p>
              </span>
              <h3 className="font-medium text-sm text-slate-700">
                {formatCurrency(item.item_product_price_at_time_purchase)}
              </h3>
            </div>
          </section>
        </figcaption>
      ))}
    </section>
  );
}
