"use server";
import { getProductsServerAction } from "@/_action/(admin)/product";
import ProductTable from "./components/product-table";
import React from "react";
import { columns } from "./components/product-columns";
export default async function Product() {
  const products = await getProductsServerAction();

  if (products.error) {
    return;
  }
  return (
    <div className="bg-slate-50 w-full h-full min-h-screen">
        <ProductTable columns={columns} data={products} />
    </div>
  );
}
