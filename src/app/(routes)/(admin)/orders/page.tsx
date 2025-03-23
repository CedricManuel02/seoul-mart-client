"use server";
import { getOrdersServerAction } from "@/_action/(admin)/order";
import OrderTable from "./components/order-table";

export default async function Order() {
  const order = await getOrdersServerAction();
  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10">
    <div className="py-4 flex justify-between flex-col items-start gap-2 lg:items-center lg:flex-row">
      <div className="space-y-1">
        <h2 className="text-slate-700 font-semibold text-md lg:text-xl">
          Orders
        </h2>
        <p className="text-slate-500 text-xs lg:text-sm">
          Manage the shop orders.
        </p>
      </div>
    </div>
    <OrderTable order={order} />
  </div>
  );
}
