"use server";
import { getProductsServerAction } from "@/_action/(admin)/product";
import ProductTable from "./components/product-table";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Product() {
  const products = await getProductsServerAction();

  if(products.error) {
    return;
  }

  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10">
    <div className="py-4 flex justify-between flex-col items-start gap-2 lg:items-center lg:flex-row">
      <div className="space-y-1">
        <h2 className="text-slate-700 font-semibold text-md lg:text-xl">
          Product
        </h2>
        <p className="text-slate-500 text-xs lg:text-sm">
          Manage the shop products.
        </p>
      </div>
      <Link href={"/product/create"}>
        <Button variant={"outline"}>Create</Button>
      </Link>
    </div>
    <Separator />
    <ProductTable products={products} />
  </div>
  );
}
