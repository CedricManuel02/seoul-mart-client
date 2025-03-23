"use client";
import { deleteCartServerAction } from "@/_action/(user)/cart";
import { ICart, ICartItem } from "@/_interface/interface";
import { convertPriceToDiscount, formatCurrency } from "@/_utils/helper";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavigationQuantity from "./navigation-quantity";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import {
  addSelectedItems,
  calculateTotal,
  removeItem,
  removeSelectedItems,
} from "@/_redux/features/cart-slice";
import { Checkbox } from "@/components/ui/checkbox";
import { DEFAULT_ICON_SIZE } from "@/_constant/constant";
import { calculateCheckoutTotal, clearCheckoutItem, removeCheckoutItem } from "@/_redux/features/checkout-slice";

export default function NavigationCartProductList() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: ICart }) => state.cart.items);
  const selectedItems = useSelector(
    (state: { cart: ICart }) => state.cart.selectedItems
  );

  const loading = useSelector((state: { cart: ICart }) => state.cart.loading);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false); 
  async function handleDeleteCart(cart_id: string, variant_id: string) {
    setLoadingDelete(true);
    try {
      const response = await deleteCartServerAction(cart_id);
    
        dispatch(removeItem({ cart_id: cart_id }));
        dispatch(removeCheckoutItem({variant_id: variant_id}))
        dispatch(calculateTotal());
        dispatch(calculateCheckoutTotal())
    } catch (error) {
      toast({
        description: "Failed to delete cart",
      });
    } finally {
      setLoadingDelete(false);
    }
  }
  function handleSelectedProduct(cart_id: string) {
    const isSelected = selectedItems.some((item) => item.cart_id === cart_id);
    if (!isSelected) {
      dispatch(addSelectedItems({ cart_id: cart_id }));
    } else {
      dispatch(removeSelectedItems({ cart_id: cart_id }));
    }

    dispatch(calculateTotal());
  }

  return (
    <div className={loading || loadingDelete ? "opacity-80" : "opacity-100"}>
      {cartItems.slice(0, 4).map((cart: ICartItem) => (
        <div
          key={cart.cart_id}
          className={`flex items-center justify-between py-2 ${
            cart.tbl_products.product_date_deleted === null
              ? "opacity-100"
              : "opacity-70"
          }`}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              onClick={() => handleSelectedProduct(cart.cart_id)}
              disabled={
                cart.tbl_products.product_date_deleted !== null || loading
              }
              checked={selectedItems.some(
                (item) => item.cart_id === cart.cart_id
              )}
            />
              <Image
                src={cart.tbl_variants?.variant_image_url}
                alt="Product image"
                className="h-14 w-14 object-contain"
                width={50}
                height={100}
                loading="lazy"
              />
            <section>
              <h3 className="text-slate-700 text-xs font-medium">
                {cart.tbl_products.product_name.length > 20
                  ? `${cart.tbl_products.product_name.slice(0, 20)}...`
                  : cart.tbl_products.product_name}
              </h3>
              <div className="flex items-center space-x-2">
                {cart.tbl_variants.tbl_variant_item.length > 0 && cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage !== null &&
                  cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage !== 0 && (
                    <Badge
                      className="text-xs font-medium text-white bg-green-500"
                      variant={"default"}
                    >
                      {cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage}%
                    </Badge>
                  )}
                <Badge
                  className="text-xs font-medium text-slate-500"
                  variant={"outline"}
                >
                  {cart.tbl_variants.variant_name}
                </Badge>
              </div>
              <div className="py-2 flex items-center gap-2">
                <h4 className="text-slate-500 text-xs font-medium">
                  {cart.tbl_variants.tbl_variant_item.length > 0 && cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage !== null
                    ? convertPriceToDiscount(
                              cart.tbl_variants.variant_price,
                              cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage ?? 0
                            )
                    : formatCurrency(cart.tbl_variants.variant_price)}
                </h4>
                {cart.tbl_variants.tbl_variant_item.length > 0 && cart.tbl_variants.tbl_variant_item?.[0]?.tbl_discount?.discount_percentage && (
                  <p className="text-xs text-slate-500 line-through">
                    {formatCurrency(cart.tbl_variants.variant_price)}
                  </p>
                )}
                <p className="text-slate-500 text-xs">
                  {cart.tbl_variants?.variant_stocks} Available stock
                </p>
              </div>
              {/* Quantity control */}
              <NavigationQuantity cart={cart} loading={loading} />
              {cart.tbl_products.product_date_deleted && (
                <p className="text-red-500 text-xs">Not Available</p>
              )}
            </section>
          </div>
          <Button
            variant={"link"}
            onClick={() => handleDeleteCart(cart.cart_id, cart.tbl_variants.variant_id)}
            disabled={loading}
          >
            <Trash2Icon
              size={DEFAULT_ICON_SIZE}
              className="text-slate-500 cursor-pointer hover:text-slate-700"
            />
          </Button>
        </div>
      ))}
    
    </div>
  );
}
