"use client";
import { ICheckout, ICheckoutArray } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

export default function CheckoutProductList() {
  const checkout = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.item
  );
  const totalPrice = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.totalPrice
  );
  const shipping_fee = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.shippingFee
  );
  const shipping_days = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.shippingDays
  );
  const shipping_loading = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.shippingLoading
  );

  return (
    <div className="bg-white h-auto rounded shadow p-8 w-full lg:w-4/12 lg:py-10">
      <h3 className="font-semibold text-sm text-slate-900">Checkout Items</h3>
      <p className="text-slate-500 text-sm">Listed below your item purchased</p>
      {checkout.map((product: ICheckout, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Image
              src={product.tbl_variants?.variant_image_url!}
              alt="Product Image"
              className="w-auto h-auto"
              width={40}
              height={100}
              loading="lazy"
            />
            <section>
              <h3 className="text-slate-700 text-xs md:text-sm font-medium">
                {product.tbl_products?.product_name}
              </h3>
              <Badge
                variant={"outline"}
                className="text-slate-500 font-medium text-xs"
              >
                {product.tbl_variants?.variant_name}
              </Badge>
              <div className="flex items-center gap-2">
                <h4 className="text-slate-500 font-medium">
                  {product?.tbl_variants &&
                  product?.tbl_variants?.tbl_variant_item?.length > 0
                    ? formatCurrency(
                        Number(product?.tbl_variants?.variant_price) -
                          (Number(product?.tbl_variants?.variant_price) *
                            Number(
                              product?.tbl_variants?.tbl_variant_item?.[0]
                                ?.tbl_discount?.discount_percentage
                            )) /
                            100
                      )
                    : formatCurrency(product.tbl_variants?.variant_price!)}
                </h4>
                {product.tbl_variants?.tbl_variant_item?.[0]?.tbl_discount
                  ?.discount_percentage && (
                  <p className="line-through text-xs text-slate-500">
                    {formatCurrency(product.tbl_variants.variant_price)}
                  </p>
                )}
              </div>
            </section>
          </div>
          <p className="text-slate-500">x {product.quantity}</p>
        </div>
      ))}
      {/* Total Section */}
      <div className="py-4">
        <Separator orientation="horizontal" />
        <div className="flex items-center justify-between">
          <h3 className="text-sm py-2 text-slate-700 font-medium">Sub Total</h3>
          <p>{formatCurrency(totalPrice)}</p>
        </div>
        {shipping_fee !== undefined && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm py-2 text-slate-700 font-medium">
              Shipping Fee
            </h3>
            {shipping_loading ? (
              <Skeleton className="w-[100px] h-[20px] rounded" />
            ) : shipping_fee !== null &&
              !Number.isNaN(Number(shipping_fee)) &&
              Number(shipping_fee) !== 0 ? (
              <div>
                <p>{formatCurrency(Number(shipping_fee))}</p>
              </div>
            ) : (
              <Badge
                variant={"secondary"}
                className="font-medium text-xs text-slate-500"
              >
                Not Available
              </Badge>
            )}
          </div>
        )}
        {shipping_days !== 0 && 
          (
              <p className="text-slate-500 text-right text-sm">Will be delivered in {shipping_days} days</p>
          )
        }
        <div className="flex items-center justify-between">
          <h3 className="text-sm py-2 text-slate-700 font-medium">Total</h3>
          <p className="text-xl">{formatCurrency(totalPrice + shipping_fee)}</p>
        </div>
      </div>
    </div>
  );
}
