"use client";

import { IOrders, IOrderStatus, IItems, IRating } from "@/_interface/interface";
import React from "react";
import PurchaseCancelOrder from "./purchase-cancel-order";
import { Button } from "@/components/ui/button";
import PurchaseOrderReceivedModal from "./purchase-order-received-modal";
import PurchaseRatingModal from "./purchase-rating-modal";

export default function PurchaseActionButton({ order }: { order: IOrders }) {
  const allItemsRated = order.tbl_items.every((item: IItems) => order.tbl_rating.some((rating: IRating) => rating.variant_id === item.variant_id));

  const deliveredStatus = order.tbl_order_status.find((status: IOrderStatus) => status.tbl_status.status_name === "DELIVERED");

  let isRefundAvailable = false;
  
  if (deliveredStatus?.order_status_date_created) {
    const deliveredDate = new Date(deliveredStatus.order_status_date_created);
    const currentDate = new Date();
    const diffInDays = Math.floor((currentDate.getTime() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));

    isRefundAvailable = diffInDays <= 7;
  }

  return (
    <div className="py-4 w-full md:w-10/12 lg:w-7/12 h-auto flex items-center justify-end space-x-2">
      {deliveredStatus && !allItemsRated && <PurchaseRatingModal order={order} />}

      {deliveredStatus && isRefundAvailable && <Button>Request Refund</Button>}

      {order.tbl_order_status.some((status: IOrderStatus) => status.tbl_status.status_name === "PAID") &&
        !order.tbl_order_status.some((status: IOrderStatus) => status.tbl_status.status_name === "SHIPPED") && !order.tbl_order_status.some((status: IOrderStatus) => status.tbl_status.status_name === "CANCELLED") && (
          <PurchaseCancelOrder order_id={order.order_id} />
        )}

      {order.tbl_order_status.some((status: IOrderStatus) => status.tbl_status.status_name === "SHIPPED") &&
        !order.tbl_order_status.some((status: IOrderStatus) => status.tbl_status.status_name === "DELIVERED") && (
          <PurchaseOrderReceivedModal order_id={order.order_id} />
        )}
    </div>
  );
}
