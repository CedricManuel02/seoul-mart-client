"use server";
import { getOrderServerAction } from "@/_action/(user)/order";
import { IItems, IOrders, IOrderStatus } from "@/_interface/interface";
import { formatCurrency, formatDate, formatDateWithTime, formatPHPhoneNumber } from "@/_utils/helper";
import Custom404 from "@/app/not-found";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Truck, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import PurchaseActionButton from "../components/purchase-action-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ItemCommentStarRating from "../../../products/item/components/item-comment-star-rating";

export default async function PurchasedItem({ params }: { params: { id: string } }) {
  const { id } = await params;

  if (!id) return <Custom404 />;

  const order: IOrders = await getOrderServerAction({ order_id: id });
  if (!order) return <Custom404 />;

  const totalItems = order.tbl_items.reduce(
    (sum: number, item: IItems) => sum + Number(item.item_product_price_at_time_purchase) * Number(item.item_quantity),
    0
  );

  const total = totalItems + order.order_shipping_fee;

  return (
    <div className="p-4 min-h-screen w-full bg-slate-50 flex flex-col items-center justify-start gap-2">
      {/* Order Information */}
      <div className="px-4 w-full md:w-10/12 lg:w-7/12 h-auto bg-white shadow rounded">
        <div className="py-4">
          <h4 className="text-slate-700 text-sm font-medium py-4">Order ID {order.order_number}</h4>
          <div className="text-slate-500 font-medium text-sm flex flex-wrap lg:flex-row lg:items-center lg:space-x-2 gap-2">
            <p>Order date: {formatDate(order.order_date_created.toString())} </p>
            <Separator className="h-4 hidden md:block" orientation={"vertical"} />
            <span className="flex items-center gap-2 text-green-500">
              <Truck size={18} />
              <p>Estimated delivery: {formatDate(order.order_target_date_received.toString())} </p>
            </span>
          </div>
        </div>
        <Separator orientation={"horizontal"} />
        {/* Steps Delivery Status */}
        <div className="h-auto py-10 flex items-center justify-center">
          <div className="relative w-full lg:w-10/12 flex flex-col sm:flex-row items-center justify-between">
            <Separator className="absolute top-4 z-0 hidden sm:block" />
            <div className="flex flex-col items-center sm:items-start justify-center space-y-4 z-10">
              <div
                className={`${
                  order.tbl_order_status.some((item: IOrderStatus) => item.status.replace("_", " ") === "PLACED ORDER")
                    ? "bg-green-500"
                    : "bg-slate-400"
                } w-7 h-7 rounded-full text-white flex items-center justify-center`}
              >
                <Check size={14} />
              </div>
              <p className="text-slate-700 text-sm">Placed Order</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 z-10">
              <div
                className={`${
                  order.tbl_order_status.some((item: IOrderStatus) => item.status === "PAID") ? "bg-green-500" : "bg-slate-400"
                } w-7 h-7 rounded-full text-white flex items-center justify-center`}
              >
                <Check size={14} />
              </div>
              <p className="text-slate-700 text-sm">Paid</p>
            </div>
            {order.tbl_cancelled_order && order.tbl_order_status.some((item: IOrderStatus) => item.status === "CANCELLED") && (
              <div className="flex flex-col items-center justify-center space-y-4 z-10">
                <div className="bg-red-500 w-7 h-7 rounded-full text-white flex items-center justify-center">
                  <X size={14} />
                </div>
                <p className="text-slate-700 text-sm">Cancelled</p>
              </div>
            )}
            <div className="flex flex-col items-center justify-center space-y-4 z-10">
              <div
                className={`${
                  order.tbl_order_status.some((item: IOrderStatus) => item.status === "SHIPPED") ? "bg-green-500" : "bg-slate-400"
                } w-7 h-7 rounded-full text-white flex items-center justify-center`}
              >
                <Check size={14} />
              </div>
              <p className="text-slate-700 text-sm">Shipped</p>
            </div>
            <div className="flex flex-col items-center sm:items-end justify-center space-y-4 z-10">
              <div
                className={`${
                  order.tbl_order_status.some((item: IOrderStatus) => item.status === "DELIVERED") ? "bg-green-500" : "bg-slate-400"
                } w-7 h-7 rounded-full text-white flex items-center justify-center`}
              >
                <Check size={14} />
              </div>
              <p className="text-slate-700 text-sm">Received</p>
            </div>
          </div>
        </div>
        {/* Product Information */}
        <div className="w-full flex flex-col gap-2 py-4">
          {order.tbl_items.map((item: IItems) => (
            <figcaption className="flex space-x-4 w-full" key={item.item_id}>
              <figure>
                <Image
                  className="shadow p-2 rounded object-contain"
                  src={item.item_product_image}
                  alt={item.item_variant_name}
                  height={50}
                  width={50}
                />
              </figure>
              <section className="w-full flex items-start justify-between">
                <div className="flex flex-col">
                  <h3 className="font-medium text-sm text-slate-700">{item.item_product_name}</h3>
                  <span className="font-medium text-xs text-slate-500 flex items-center space-x-2">
                    <p>{item.item_product_variant}</p>
                    <Separator className="h-4" orientation={"vertical"} />
                    <p>x {item.item_quantity}</p>
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <h3 className="font-medium text-sm text-slate-700">{formatCurrency(item.item_product_price_at_time_purchase)}</h3>
                </div>
              </section>
            </figcaption>
          ))}
          {/* Product Total */}
          <div className="h-auto flex flex-col items-end justify-center gap-4 py-4">
            <div className="w-full sm:w-5/12 lg:w-4/12 flex items-center justify-between">
              <h4 className="text-sm">Subtotal</h4>
              <p className="font-medium text-sm text-slate-700">{formatCurrency(totalItems)}</p>
            </div>
            <div className="w-full sm:w-5/12 lg:w-4/12 flex items-center justify-between">
              <h4 className="text-sm">Shipping Fee</h4>
              <p className="font-medium text-sm text-slate-700">{formatCurrency(order.order_shipping_fee)}</p>
            </div>
            <div className="w-full sm:w-5/12 lg:w-4/12 flex items-center justify-between">
              <h4 className="text-sm">Mode of Payment</h4>
              <p className="font-medium text-sm text-slate-700">
                {order.tbl_order_payment.payment_method.charAt(0).toUpperCase() + order.tbl_order_payment.payment_method.slice(1)}
              </p>
            </div>
            <div className="w-full sm:w-5/12 lg:w-4/12 flex items-center justify-between">
              <h4 className="text-sm">Total</h4>
              <p className="font-medium text-sm text-slate-700">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Address & Deliver Status*/}
      <div className="w-full md:w-10/12 lg:w-7/12 h-auto">
        <div className="flex gap-2 lg:justify-between flex-col lg:flex-row">
          <div className="w-full bg-white shadow rounded p-4">
            <h3 className="font-medium text-sm text-slate-800 py-2">Delivery Address</h3>
            <div className="w-full flex flex-col space-y-2 font-normal text-slate-500 text-sm">
              <h3>{`${order.tbl_order_information[0].order_information_first_name} ${order.tbl_order_information[0].order_information_last_name}`}</h3>
              <span>{formatPHPhoneNumber(order.tbl_order_information[0].order_information_phone)}</span>
              <address>
                {`${order.tbl_order_information[0].order_address_complete}, ${order.tbl_order_information[0].order_address_cities}, ${order.tbl_order_information[0].order_address_province}`}
              </address>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row md:justify-between gap-4 bg-white shadow rounded p-4">
            <div className="w-full">
              <h3 className="font-medium text-sm text-slate-800 py-2">Delivery Status</h3>
              <ul className="text-slate-500 text-sm font-medium list-disc px-4">
                {order.tbl_order_status.map((status: IOrderStatus) => (
                  <li key={status.order_status_id}>
                    <h3 className="font-medium text-slate-700">
                      {status.status} {status.status === "CANCELLED" && order.tbl_cancelled_order.cancelled_reason}
                    </h3>
                    <p>{formatDateWithTime(String(status.order_status_date_created))}</p>
                  </li>
                ))}
              </ul>
            </div>
            {order.tbl_order_status.some((item: IOrderStatus) => item.status === "SHIPPED") && (
              <div className="w-full">
                <h3 className="font-medium text-sm text-slate-800 py-2">Delivery Information</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"} className="font-medium text-slate-500 text-xs">
                    {order.tbl_delivery_information.delivery_company}
                  </Badge>
                  <Badge variant={"outline"} className="font-medium text-slate-500 text-xs">
                    Plate No. {order.tbl_delivery_information.delivery_plate_number}
                  </Badge>
                </div>
                <p className="font-medium text-slate-500 text-sm">Rider {order.tbl_delivery_information.delivery_rider_name}</p>
                <p className="font-medium text-slate-500 text-sm">{formatPHPhoneNumber(order.tbl_delivery_information.delivery_rider_phone)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Product already rated*/}
      {order.tbl_rating.length > 0 && (
         <div className="w-full md:w-10/12 lg:w-7/12 h-auto bg-white py-4 p-6 rounded-md shadow">
         <div className="py-3">
           <h3 className="font-semibold text-sm text-slate-900">Product Rating</h3>
           <p className="text-slate-500 text-sm">List of user rating</p>
         </div>
           <div className="flex flex-col gap-4 py-4">
             {order.tbl_rating.map((rating: any) => (
               <div
                 key={rating.rating_id}
                 className={`${rating.rating_date_deleted ? "opacity-50" : "opacity-100"} p-2 flex items-start justify-between`}
               >
                 <div className="flex items-start gap-2">
                   <Avatar className="w-8 h-8 cursor-pointer hover:opacity-90">
                     <AvatarImage
                       src={`${
                         rating.tbl_users.user_profile
                           ? rating.tbl_users.user_profile
                           : `https://api.dicebear.com/9.x/initials/svg?seed=${rating.tbl_users.user_name}`
                       }`}
                     />
                     <AvatarFallback>CN</AvatarFallback>
                   </Avatar>
                   <div>
                     <h3 className="text-slate-700 text-sm font-medium">{rating.tbl_users.user_name}</h3>
                     <p className="text-slate-500 text-xs font-medium">{formatDate(rating.rating_date_created)}</p>
                     <div className="flex items-center gap-2">
                       <ItemCommentStarRating rating={rating.rating} />
                       <div className="flex items-center gap-2">
                         <Badge variant={"secondary"} className="text-xs font-medium">
                           {rating.tbl_variants.variant_name}
                         </Badge>
                         {rating.rating_date_deleted && (
                           <Badge variant={"destructive"} className="text-xs font-medium">
                             Removed
                           </Badge>
                         )}
                       </div>
                     </div>
                     <p className="text-sm text-slate-500 py-2 w-full lg:w-7/12">{rating.rating_text}</p>
                   </div>
                 </div>
              
               </div>
             ))}
           </div>
       </div>
      )}
      {/* Button For Order Action */}
      <PurchaseActionButton order={order} />
    </div>
  );
}
