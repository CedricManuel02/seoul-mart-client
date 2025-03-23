"use server";
import { getProductsServerAction } from "@/_action/(admin)/product";
import ProductCard from "@/_components/product/product-card";
import ProductCardContainer from "@/_components/product/product-card-container";
import Header from "@/_components/shared/container-header/header";
import { IProduct } from "@/_interface/interface";
interface CategoryInterface {
  query: string;
}

export default async function Category({ params: paramsPromise }: { params: Promise<CategoryInterface> }) {
    const resolvedParams = await paramsPromise;
    const decodeUri = resolvedParams.query ? decodeURIComponent(resolvedParams.query) : "";
    const product = await getProductsServerAction();
    
    const sortedProduct = product.filter((product : IProduct) => product.tbl_categories.category_name === decodeUri);
   
  return (
    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-5">
      <Header text={`Results for Category ${decodeUri}`} url={null} />
      {sortedProduct.length > 0 ? (
        <ProductCardContainer>
          {sortedProduct.map((product: IProduct) => (
            <ProductCard key={product.product_id} {...product} />
          ))}
        </ProductCardContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 w-full">
          <p>
            No result found
          </p>
        </div>
      )}
    </div>
  );
}
