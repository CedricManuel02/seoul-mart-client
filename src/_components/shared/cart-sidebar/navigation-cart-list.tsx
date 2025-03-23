"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { calculateTotal, clearItem, clearSelectedItems, listItem } from "@/_redux/features/cart-slice";
import {persistor} from "@/_redux/store";
import NavigationCartProductList from "./navigation-cart-product-list";
import { calculateCheckoutTotal } from "@/_redux/features/checkout-slice";

export default function NavigationCartList({ cart }: { cart: any }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if(cart.length > 0) {
      dispatch(clearItem());
      persistor.purge();
      cart.forEach((cart: any) => {
        dispatch(listItem({
          cart_id: cart.cart_id,
          tbl_products: cart.tbl_products,
          tbl_variants: cart.tbl_variants,
          cart_item_quantity: cart.cart_item_quantity
        }));
      })
      dispatch(calculateTotal())
      dispatch(calculateCheckoutTotal())
    }
  }, [dispatch])

  return (<NavigationCartProductList/>);
}
