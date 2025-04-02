import { getOrdersServerAction } from "@/_action/(admin)/order";
import { IOrders } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function DashboardTopSelling() {
  const response: IOrders[] = await getOrdersServerAction();

  const product_count: { [variant_id: string]: { quantity: number; name: string; variant: string; image: string; price: number } } = {};

  response.forEach((order) => {
    order.tbl_items.forEach((item) => {
      const variant_id = item.variant_id;
      if (product_count[variant_id]) {
        product_count[variant_id].quantity += item.item_quantity;
      } else {
        product_count[variant_id] = {
          quantity: item.item_quantity,
          image: item.item_product_image,
          name: item.item_product_name,
          variant: item.item_variant_name,
          price: item.item_product_price_at_time_purchase,
        };
      }
    });
  });

  const sorted_products = Object.keys(product_count)
    .map((variant_id) => ({
      variant_id,
      item_quantity: product_count[variant_id].quantity,
      image: product_count[variant_id].image,
      name: product_count[variant_id].name,
      variant: product_count[variant_id].variant,
      price: product_count[variant_id].price,
    }))
    .sort((a, b) => b.item_quantity - a.item_quantity);

  return (
    <Card className="rounded-md bg-white shadow-sm  h-full px-4 w-full">
      <header className="flex items-center justify-between py-4 px-2 border-b">
        <h4 className="text-slate-700 text-sm font-medium">Top Selling Products</h4>
        <Link href={"/product"} className="text-slate-500 text-sm hover:text-green-500">
          See all
        </Link>
      </header>
      <div className="pb-2">
        {sorted_products.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center justify-start gap-2 px-4 py-2 rounded-md hover:bg-slate-100">
            <p className="text-slate-500 text-sm">{index + 1}</p>
            <Image className="rounded" src={item.image} alt="Product" width={40} height={40} />
            <div>
              <h4 className="font-medium text-sm text-slate-700">{item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}</h4>
              <div className="flex gap-2 text-xs text-slate-500">
                <p>{item.variant}</p>
                <Separator orientation="vertical" className="h-5"/>
                <p>{formatCurrency(item.price)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
