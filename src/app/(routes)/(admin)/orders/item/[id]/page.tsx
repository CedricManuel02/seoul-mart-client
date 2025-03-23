import React from "react";
import Custom404 from "@/app/not-found";
import { Badge } from "@/components/ui/badge";
import { IOrders } from "@/_interface/interface";
import OrderMapBox from "../components/order-map-box";
import OrderHeaderCard from "../components/order-header-card";
import OrderActionButton from "../components/order-action-button";
import { getOrderItemServerAction } from "@/_action/(admin)/order";
import OrderProductTimeline from "../components/order-product-timeline";
import OrderProductShipment from "../components/order-product-shipment";
import OrderProductItemsContainer from "../components/order-product-items-container";
export default async function OrderItem({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const order: IOrders = await getOrderItemServerAction({ order_id: id });

  if (!order) {
    return <Custom404 />;
  }

  return (
    <div className="sm:p-4 min-h-screen w-full bg-slate-50 flex flex-col items-center justify-start gap-2">
      <div className="px-4 w-full md:w-10/12 lg:w-7/12 h-auto bg-white sm:shadow rounded">
        {/* Map Information */}
        <div className="py-4">
          <p className="py-4 text-slate-700 text-sm font-semibold">
            Delivery Destination
          </p>
          <OrderMapBox
            start={[120.97535138528272, 14.420798886325754]}
            destination={[
              order.tbl_order_information[0].order_information_delivery_longitude,
              order.tbl_order_information[0].order_information_delivery_latitude,
            ]}
            barangay={order.tbl_order_information[0].order_address_barangay}
          />
        </div>
        {/* Order Information */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-slate-500 text-sm">Order ID</p>
            <h4 className="text-slate-700 text-sm font-semibold">
              #{order.order_number}
            </h4>
          </div>
          <Badge variant={"default"} className="bg-green-100 text-green-500 hover:bg-green-100 hover:text-green-500">
            {order.tbl_order_status[0].tbl_status.status_name}
          </Badge>
        </div>
        {/* Delivery Information */}
        <OrderHeaderCard order={order} />
        {/* Order Status */}
        <div className="flex flex-col md:flex-row justify-between gap-2">
          {/* Order Timeline */}
          <OrderProductTimeline order={order} />
          {/* Order Shipment */}
          <OrderProductShipment order={order} />
        </div>
        <OrderProductItemsContainer order={order} />
        {/* Button For Order Action */}
        <OrderActionButton order={order} />
      </div>
    </div>
  );
}
