import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { convertPriceToDiscount, formatCurrency } from "@/_utils/helper";
import { IProduct } from "@/_interface/interface";
import { Badge } from "@/components/ui/badge";
import ProductStarRating from "./product-star-rating";

export default function ProductCard(product: IProduct) {
  const bestVariant = product.tbl_variants.reduce((best, variant) => {
    const bestDiscount = best.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ?? 0;
    const currentDiscount = variant.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ?? 0;
    return currentDiscount > bestDiscount ? variant : best;
  }, product.tbl_variants[0]);

  const discount = bestVariant.tbl_variant_item?.[0]?.tbl_discount;
  const discountPercentage = discount?.discount_percentage ?? 0;
  const endDate = discount?.discount_end_date ? new Date(discount.discount_end_date) : null;
  const isDiscountActive = endDate ? endDate > new Date() : true;
  
  return (
    <Link key={product.product_id} href={`/products/item/${product.product_id}`}>
      <Card className="overflow-hidden h-auto cursor-pointer relative shadow-sm border-slate-300 hover:shadow-md">
        <CardContent className="flex flex-col gap-5 h-auto items-center justify-center p-4">
          {discountPercentage > 0 && isDiscountActive && (
            <Badge variant="default" className="bg-green-400 hover:bg-green-400 text-white rounded-full absolute top-2 left-2">
              {discountPercentage}% OFF
            </Badge>
          )}
          <Image
            src={bestVariant.variant_image_url}
            alt={product.product_name}
            className="h-36 w-32 object-contain"
            width={100}
            height={100}
            loading="lazy"
          />
          <section className="w-full whitespace-nowrap">
            <h3 className="text-slate-700 text-xs md:text-sm font-medium">
              {product.product_name.length > 18 ? `${product.product_name.slice(0, 18)}...` : product.product_name}
            </h3>
            <ProductStarRating product={product} />
            {discountPercentage > 0 ? (
              <div className="flex items-center gap-2">
                <h4 className="text-slate-700 font-medium">
                  {convertPriceToDiscount(bestVariant.variant_price, bestVariant.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ?? 0)}
                </h4>
                <p className="text-xs text-slate-500 line-through">
                  {formatCurrency(bestVariant.variant_price)}
                </p>
              </div>
            ) : (
              <h4 className="text-slate-700 font-medium">
                {formatCurrency(bestVariant.variant_price) || "0.00"}
              </h4>
            )}
          </section>
        </CardContent>
      </Card>
    </Link>
  );
}
