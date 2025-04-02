import { getOrdersServerAction } from "@/_action/(admin)/order";
import { IItems, IOrders } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function DashboardRecentOrders() {
  const orders: IOrders[] = await getOrdersServerAction();

  const calculateTotal = (item: IItems[]) => {
    return item.reduce((sum, item) => sum + item.item_product_price_at_time_purchase * item.item_quantity, 0);
  };

  return (
    <Card className="rounded-md bg-white shadow-sm min-h-44 h-full px-4 w-full">
      <header className="flex items-center justify-between py-4 px-2 border-b">
        <h4 className="text-slate-700 text-sm font-medium">Recent Orders</h4>
        <Link href={"/orders"} className="text-slate-500 text-sm hover:text-green-500">
          See all
        </Link>
      </header>
      <div className="pb-2">
        {orders.slice(0, 5).map((order, index) => (
          <Link
            href={`/orders/item/${order.order_id}`}
            key={index}
            className="flex items-center justify-between gap-2 px-4 py-2 rounded-md hover:bg-slate-100"
          >
            <div className="flex items-center gap-2">
              <p className="text-slate-500 text-sm">{index + 1}</p>
              <Image className="rounded" src={order.tbl_items[0].item_product_image} alt="Product" width={40} height={40} />
              <div>
                <h4 className="font-medium text-sm text-slate-700">
                  {order.tbl_items[0].item_product_name.length > 20
                    ? `${order.tbl_items[0].item_product_name.slice(0, 20)}...`
                    : order.tbl_items[0].item_product_name}
                </h4>
                <div className="flex gap-2 text-xs text-slate-500">
                <p>{order.tbl_items.length} {order.tbl_items.length > 1 ? "items" : "item"}</p>
                <Separator orientation="vertical" className="h-4"/>
                <p>Total {formatCurrency(calculateTotal(order.tbl_items))}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
