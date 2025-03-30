"use server";
import { getOrdersServerAction } from "@/_action/(admin)/order";
import OrderTable from "./components/order-table";
import { columns } from "./components/order-columns";

export default async function Order() {
  const order = await getOrdersServerAction();
  return (
    <div className="w-full h-full bg-slate-50">
      <OrderTable data={order} columns={columns} />
    </div>
  );
}
