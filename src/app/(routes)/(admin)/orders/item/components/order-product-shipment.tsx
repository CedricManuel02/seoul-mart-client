import { IOrders } from "@/_interface/interface";
import { formatPHPhoneNumber } from "@/_utils/helper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React from "react";

export default function OrderProductShipment({ order }: { order: IOrders }) {
  return (
    <section className="border rounded p-4 w-full">
      <h3 className="text-slate-500 text-xs font-medium">Shipment</h3>
      <div className="flex gap-2 py-4">
        <Avatar className="w-5 h-5 cursor-pointer hover:opacity-90">
          <AvatarImage
            src={
              order.tbl_users.user_profile !== null
                ? `${order.tbl_users.user_profile!}`
                : `https://api.dicebear.com/9.x/initials/svg?seed=${order.tbl_users.user_name}`
            }
          />
        </Avatar>
        <div>
          <h3 className="text-sm font-medium">{order.tbl_users.user_name}</h3>
          <p className="text-xs text-slate-500">{order.tbl_users.user_email}</p>
        </div>
      </div>
      <div className="w-full">
        <h4 className="text-slate-700 text-xs font-medium py-2">Recipient</h4>
        <p className="text-slate-500 text-sm">
          {order.tbl_order_information[0].order_information_first_name}{" "}
          {order.tbl_order_information[0].order_information_last_name}
        </p>
      </div>
      <div className="w-full">
        <h4 className="text-slate-700 text-xs font-medium py-2">
          Delivery address
        </h4>
        <address className="text-slate-500 text-sm">
          {order.tbl_order_information[0].order_address_complete}{" "}
        </address>
      </div>
      <div className="w-full">
        <h4 className="text-slate-700 text-xs font-medium py-2">Contact No.</h4>
        <p className="text-slate-500 text-sm">
          {formatPHPhoneNumber(
            order.tbl_order_information[0].order_information_phone
          )}
        </p>
      </div>
    </section>
  );
}
