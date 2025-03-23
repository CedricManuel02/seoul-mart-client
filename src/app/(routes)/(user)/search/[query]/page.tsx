"use server";

import { getProductsServerAction } from "@/_action/(admin)/product";
import ProductCard from "@/_components/product/product-card";
import ProductCardContainer from "@/_components/product/product-card-container";
import Header from "@/_components/shared/container-header/header";
import { IProduct } from "@/_interface/interface";

interface SearchProps {
  query: string;
}

export default async function Search({params: paramsPromise,}: {params: Promise<SearchProps>;}) {
  const resolvedParams = await paramsPromise;
  const decodeUri = resolvedParams.query
    ? decodeURIComponent(resolvedParams.query)
    : "";
  const product = await getProductsServerAction();

  const filteredProducts = product.filter((product : IProduct) => product.product_name.toLowerCase().includes(decodeUri.toLowerCase()))

  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-5">
      <Header text={`Search results for ${decodeUri}`} url={null} />
      {filteredProducts.length > 0 ? ( 
        <ProductCardContainer>
          {filteredProducts.map((product: IProduct) => (
            <ProductCard key={product.product_id} {...product} />
          ))}
        </ProductCardContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 w-full">
          <p>No result found</p>
        </div>
      )}
    </div>
  );
}
