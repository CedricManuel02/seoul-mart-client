import { IOrders } from "@/_interface/interface";
import React from "react";
import OrderProductList from "./order-product-list";
import OrderProductSummary from "./order-product-summary";

export default function OrderProductItemsContainer({
  order,
}: {
  order: IOrders;
}) {
  return (
    <div className="w-full flex flex-col gap-2 py-8">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-sm text-slate-700">Items</h3>
        <p className="font-semibold text-xs bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center">
          {order.tbl_items.length}
        </p>
      </div>
      <OrderProductList order={order} />
      {/* Product Total */}
      <OrderProductSummary order={order} />
    </div>
  );
}
