"use client";
import { IVariantCreate } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import React from "react";
import { useSelector } from "react-redux";
import DeleteVariantModal from "./delete-variant-modal";
import UpdateVariantModal from "./update-variant-modal";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function CreateVariantList() {
  const variant = useSelector(
    (state: { variant: IVariantCreate }) => state.variant.variant
  );
  return (
    <section className="flex flex-col space-y-2 h-auto">
     {variant.length > 0 ? (
       variant.map((variant: any, index: number) => (
        <div key={index} className="flex flex-wrap gap-2 items-center justify-between shadow py-2 px-4 rounded">
          <div className="flex items-center justify-center space-x-2 ">
            <Image
              src={variant.variant_image}
              className="w-12 h-12 p-2 object-contain"
              alt="Product image"
              width={100}
              height={100}
              loading="lazy"
            />
            <div>
              <h3 className="font-medium text-sm text-slate-700">
                {variant.variant_name}
              </h3>
              <div className="text-slate-400 text-sm font-normal flex items-center space-x-2">
                <p>
                  {formatCurrency(variant.variant_price)}
                </p>
                <Separator orientation="vertical" className="h-4"/>
                <p>
                  {variant.variant_stocks} stocks
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <UpdateVariantModal index={index} />
            <DeleteVariantModal index={index} />
          </div>
        </div>
      ))
     ) : (
      <div className="w-full flex items-center justify-center py-4 text-slate-500 text-sm">
        No Variant listed
      </div>
     )}
    </section>
  );
}
