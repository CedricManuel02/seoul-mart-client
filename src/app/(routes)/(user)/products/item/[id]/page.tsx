"use server";
import React from "react";
import ItemContainer from "../components/item-container";
import { getProductServerAction } from "@/_action/(user)/product";
import ProductContainer from "../components/product-container";
import ItemComment from "../components/item-comment";
import { auth } from "@/auth";

export default async function Item({ params }: { params: { id: string } }) {
  const session = await auth();
  const { id } = await params;
  const product = await getProductServerAction({ product_id: id });
  return (
    <section className="w-full h-auto">
      <div className="w-11/12 xl:w-10/12 min-h-screen h-auto m-auto py-5">
      <ItemContainer item={product} session={session} />
      <ItemComment product={product} />
      <ProductContainer text={id} url={"/products"} />
    </div>
    </section>
  );
}
