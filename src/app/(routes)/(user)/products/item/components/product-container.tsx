"use server";
import React from "react";
import { IProduct } from "@/_interface/interface";
import { getProductsServerAction } from "@/_action/(admin)/product";
import Header from "@/_components/shared/container-header/header";
import ProductCardContainer from "@/_components/product/product-card-container";
import ProductCard from "@/_components/product/product-card";

export default async function ProductContainer({ text, url }: any) {
  const response = await getProductsServerAction();
  const products = response.filter(
    (data: IProduct) => data.product_id !== text
  );

  return (
    <div className="pb-10">
      <Header text={"Browse more products"} url={url} />
      <ProductCardContainer>
        {products
              .slice(0, 36)
              .map((product: IProduct) => (
                <ProductCard key={product.product_id} {...product} />
              ))}
      </ProductCardContainer>
    </div>
  );
}
