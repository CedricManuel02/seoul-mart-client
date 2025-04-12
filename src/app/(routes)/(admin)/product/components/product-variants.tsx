import { IVariants } from "@/_interface/interface";
import { convertPriceToDiscount, formatCurrency } from "@/_utils/helper";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React from "react";

export default function ProductVariants({ variant }: { variant: IVariants[] }) {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer hover:underline hover:text-green-500">{variant.length} available</HoverCardTrigger>
      <HoverCardContent className="w-auto">
        {variant.map((variants: any) => (
          <div key={variants.variant_id} className="w-auto font-medium flex py-2 items-center gap-2 whitespace-break-spaces">
            <Image
              src={variants.variant_image_url}
              alt="Variant Image"
              className="h-auto w-auto"
              width={40}
              height={100}
              loading="lazy"
            />
            <div className="whitespace-nowrap">
              <p className="text-sm">{variants.variant_name}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                {variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ? (
                  <div className="flex items-end gap-2">
                    <p>
                      {convertPriceToDiscount(variants.variant_price, variants.tbl_variant_item?.[0].tbl_discount.discount_percentage)}
                    </p>
                    <small className="line-through">
                      {formatCurrency(variants.variant_price)}
                    </small>
                  </div>
                ) : (
                  <p>{formatCurrency(variants.variant_price)}</p>
                )}
                <Separator className="h-3" orientation="vertical" />
                <p>{variants.variant_stocks} Stocks</p>
                <Separator className="h-3" orientation="vertical" />
                <p>{variants.tbl_rating.length} Review</p>
              </div>
            </div>
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
  );
}
