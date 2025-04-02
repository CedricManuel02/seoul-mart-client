"use client";
import Image from "next/image";
import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProduct, IVariants } from "@/_interface/interface";
import ProductStarRating from "@/_components/product/product-star-rating";
import ItemActionButton from "./item-action-button";
import { convertPriceToDiscount, formatCurrency } from "@/_utils/helper";

export default function ItemWrapper({ item, session }: { item: IProduct; session: any }) {
  const [quantity, setQuantity] = useState<number>(1);
  const [discountedPrice, setDiscountedPrice] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<IVariants>(item.tbl_variants[0]);
  const [selectedVariant, setSelectedVariant] = useState<IVariants>(item.tbl_variants[0]);
  const [stock, setStock] = useState<number>(0);

  useEffect(() => {
    async function updateSelectedVariant() {
      if (selectedVariant) {
        const discount = await convertPriceToDiscount(
          selectedVariant.variant_price,
          selectedVariant.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ?? 0
        );
        setStock(Number(selectedVariant.variant_stocks));
        setDiscountedPrice(discount);
      }
    }
    updateSelectedVariant();
  }, [selectedVariant]);

  const handleVariantChange = useCallback((variant_id: string) => {
    const selected = item.tbl_variants.find((variant) => variant.variant_id === variant_id);
    if (selected) {
      setQuantity(1);
      setSelectedImage(selected);
      setSelectedVariant(selected);
    }
  }, [item.tbl_variants]);

  const handleVariantImageChange = useCallback((variant_id: string) => {
    const selected = item.tbl_variants.find((variant) => variant.variant_id === variant_id);
    if (selected) {
      setSelectedImage(selected);
    }
  }, []);

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => (prev < stock ? prev + 1 : stock));
  };

  return (
    <figure className="flex flex-col items-center justify-start gap-4 lg:items-start lg:flex-row py-4">
      {/* Product Image Container */}
      <section className="w-full lg:w-6/12">
        <Image
          src={selectedImage?.variant_image_url || item.tbl_variants[0]?.variant_image_url}
          className="p-4 max-h-[225px] md:max-h-[450px] w-full object-contain"
          alt="Product Image"
          width={400}
          height={100}
          loading="lazy"
        />
        <div className="flex items-center gap-2 w-full">
          {item.tbl_variants.map((variant) => (
            <Image
              key={variant.variant_id}
              src={variant.variant_image_url}
              alt="variant image"
              className="h-20 w-20 p-4 border rounded opacity-70 hover:opacity-100 cursor-pointer"
              width={100}
              height={100}
              loading="lazy"
              onClick={() => handleVariantImageChange(variant.variant_id)}
            />
          ))}
        </div>
      </section>
      {/* Product Info Container */}
      <figcaption className="w-full lg:w-11/12 py-10">
        <h2 className="text-lg lg:text-2xl font-semibold text-slate-700">{item.product_name}</h2>
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-semibold text-slate-500">{discountedPrice}</h4>
          {selectedVariant.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage! && (
            <p className="text-sm text-slate-500 line-through">{formatCurrency(selectedVariant.variant_price)}</p>
          )}
          <p className="text-slate-500 text-sm py-2">{stock} Available stocks</p>
        </div>
        <ul className="text-slate-500 text-sm flex items-center gap-2 py-4">
          <li>
            <Badge variant={"outline"} className="text-orange-500 border-orange-500">
              {item.tbl_categories.category_name}
            </Badge>
          </li>
          <li>
            <Separator className="h-4" orientation={"vertical"} />
          </li>
          <li>
            <ProductStarRating product={item} />
          </li>
          <li>
            <Separator className="h-4" orientation={"vertical"} />
          </li>
          <li>{item.tbl_items.length} Sold</li>
        </ul>
        <p className="text-slate-500 text-sm text-justify lg:text-left">{item.product_description}</p>
        <div>
          <h3 className="font-medium py-4 text-slate-500 text-sm">Payment Method Available</h3>
          <Badge variant={"outline"}>
            <div className="flex items-center gap-2">
              <Image
                src={"https://static-00.iconduck.com/assets.00/visa-icon-2048x1313-o6hi8q5l.png"}
                alt="Card"
                className="h-auto w-auto rounded"
                width={25}
                height={100}
              />
              <p>Card</p>
            </div>
          </Badge>
          <div className="text-slate-500 text-sm text-justify flex"><p>Secured payment powered by</p><Image src={"https://vikwp.com/images/plugins/stripe.png"} alt="Stripe" width={50} height={50}/></div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
          {/* Variant Selection */}
          <Select value={selectedVariant?.variant_id} onValueChange={handleVariantChange}>
            <SelectTrigger className="max-w-[180px] my-4">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {item.tbl_variants.map((variant: IVariants) => (
                <SelectItem key={variant.variant_id} value={variant.variant_id}>
                  {variant.variant_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Counter Selection */}
          <div className="flex items-center gap-2 py-4">
            <Button variant={"outline"} onClick={handleDecrement}>
              -
            </Button>
            <Input className="w-14 text-center" type="text" value={quantity} readOnly />
            <Button variant={"outline"} onClick={handleIncrement}>
              +
            </Button>
          </div>
        </div>
        <ItemActionButton session={session} product_id={item.product_id} selected_variant_id={selectedVariant.variant_id} item_quantity={quantity} />
      </figcaption>
    </figure>
  );
}
