"use client"
import { IProduct, IVariants } from "@/_interface/interface";
import Image from "next/image";
import React, { useState } from "react";

export default function ItemImage({ item }: { item: IProduct }) {
  const [selectedImage, setSelectImage] = useState<IVariants | null>(
    item.tbl_variants[0]
  );
  const handleVariantImageChange = (variant_id: string) => {
    const selected = item.tbl_variants.find(
      (variant) => variant.variant_id === variant_id
    );
    if (selected) {
      setSelectImage(selected);
    }
  };

  return (
    <section className="w-6/12">
      <Image
        src={
          selectedImage?.variant_image_url ||
          item.tbl_variants[0]?.variant_image_url
        }
        className="p-4 h-full w-full"
        alt="Product Image"
        width={400}
        height={100}
        loading="lazy"
      />
      <div className="flex items-center gap-2">
        {item.tbl_variants.map((variant) => (
          <Image
            key={variant.variant_id}
            src={variant.variant_image_url}
            alt="variant image"
            className="h-20 w-20 p-4 border rounded opacity-70 hover:opacity-100 cursor-pointer"
            width={70}
            height={100}
            loading="lazy"
            onClick={() => handleVariantImageChange(variant.variant_id)}
          />
        ))}
      </div>
    </section>
  );
}
