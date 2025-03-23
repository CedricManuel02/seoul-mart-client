"use server"
import { getProductsServerAction } from '@/_action/(admin)/product';
import ProductCard from '@/_components/product/product-card';
import ProductCardContainer from '@/_components/product/product-card-container'
import { IProduct } from '@/_interface/interface';
import React from 'react'

export default async function Products() {
  const product = await getProductsServerAction();
  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-5">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
      <h1 className="text-slate-700 font-semibold text-md lg:text-xl">
        Browse our products
      </h1>
    </div>
     <ProductCardContainer>
      {product.map((product : IProduct) => (
        <ProductCard key={product.product_id} {...product}/>
      ))}
    </ProductCardContainer>
   </div>
  )
}
