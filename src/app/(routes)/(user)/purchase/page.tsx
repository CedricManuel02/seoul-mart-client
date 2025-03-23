import { getUserOrderServerAction } from "@/_action/(user)/order";
import { formatCurrency } from "@/_utils/helper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingBasket, Store } from "lucide-react";
import Image from "next/image";
import React from "react";
import PurchaseButton from "./components/purchase-button";
import { IOrders } from "@/_interface/interface";
import NavigationNotificationIcon from "@/_components/shared/navigation-bar/navigation-notification-icon";

export default async function Purchased() {
  const order: IOrders[] = await getUserOrderServerAction();
  return (
    <div className="h-auto min-h-screen w-full bg-slate-50 py-4 px-2">
      <header className="text-sm w-full lg:w-5/12 m-auto h-20 flex flex-col justify-center">
        <h2 className="font-medium">Purchased Products</h2>
        <p className="text-slate-500">Your recent purchased products</p>
      </header>
      {order.length > 0 ? (
        <div className="flex flex-col space-y-2 w-full lg:w-5/12 m-auto">
          {order.map((order: IOrders) => (
            <div
              key={order.order_id}
              className="bg-white shadow rounded px-4 py-2"
            >
              <div className="text-slate-900 text-sm flex items-center justify-between border-b py-4">
                <div className="flex flex-col items-start">
                  <div className="flex items-center justify-center space-x-2">
                    <h4 className="font-medium">Bella and Pepper</h4>
                    <Store size={17} />
                  </div>
                  <p className="text-slate-500">Order # {order.order_number}</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <div className="p-1 bg-slate-200 rounded-full">
                  <NavigationNotificationIcon
                    status={order.tbl_order_status[0].tbl_status.status_name}
                  /></div>{" "}
                  <p>{order.tbl_order_status[0].tbl_status.status_name}</p>
                </div>
              </div>
              <div className="w-full ">
                {order.tbl_items.map((item: any, index: number) => (
                  <div key={item.item_id}>
                    {index === 1 && <Separator orientation={"horizontal"} />}
                    <figcaption className="w-full flex items-start justify-start space-x-2 py-2">
                      <figure>
                        <Image
                          src={item.item_product_image as string}
                          alt={item.item_product_name}
                          className="w-auto h-auto object-contain"
                          width={50}
                          height={50}
                        />
                      </figure>
                      <section className="w-full ">
                        <h3 className="font-medium text-sm">
                          {item.item_product_name}
                        </h3>
                        <p className="text-slate-500 text-xs font-medium">
                          {item.item_variant_name}
                        </p>
                        <p className="text-slate-500 text-right">
                          x {item.item_quantity}
                        </p>
                        <p className="text-slate-500 text-right">
                          {formatCurrency(
                            item.item_product_price_at_time_purchase
                          )}
                        </p>
                      </section>
                    </figcaption>
                  </div>
                ))}
              </div>
              <PurchaseButton order_id={order.order_id} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col space-y-2 items-center justify-center">
          <ShoppingBasket size={60} className="text-slate-500" />
          <h3 className="text-md font-medium text-slate-700">
            Your cart is empty
          </h3>
          <p className="text-sm text-center text-slate-400">
            Looks like you have not added anything to your cart. Go ahead &
            explore top products
          </p>
          <Button
            className="bg-green-500 hover:bg-green-700"
            variant={"default"}
          >
            Continue Shipping
          </Button>
        </div>
      )}
    </div>
  );
}
