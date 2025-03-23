"use server";
import React from "react";
import Header from "../shared/container-header/header";
import ProductCardContainer from "./product-card-container";
import { IProduct } from "@/_interface/interface";
import ProductCard from "./product-card";
import { getProductsServerAction } from "@/_action/(admin)/product";

export default async function ProductContainer({ text, url }: any) {
  const response = await getProductsServerAction();
  const products = response.filter((data: IProduct) => data.tbl_categories.category_name === text);
  return (
    <div className="pb-10">
      <Header text={text} url={url} />
      <ProductCardContainer>
        {products.length > 0
          && products
              .slice(0, 12)
              .map((product: IProduct) => (
                <ProductCard key={product.product_id} {...product} />
              ))
          }
      </ProductCardContainer>
    </div>
  );
}
