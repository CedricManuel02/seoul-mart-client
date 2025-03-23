"use client";
import { ICart } from "@/_interface/interface";
import { formatCurrency } from "@/_utils/helper";
import { Button } from "@/components/ui/button";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ButtonLoading from "../button-loading/button-loading";
import { setLoading } from "@/_redux/features/cart-slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { addCheckoutItem, calculateCheckoutTotal, clearCheckoutItem } from "@/_redux/features/checkout-slice";

export default function NavigationCartFooter() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: ICart }) => state.cart.items);
  const loading = useSelector((state: { cart: ICart }) => state.cart.loading);
  const total = useSelector((state: { cart: ICart }) => state.cart.totalPrice);
  const selected = useSelector((state: { cart: ICart }) => state.cart.selectedItems);
  const router = useRouter();
  async function handleCheckout() {
    try {
      dispatch(setLoading());
  
      if (selected.length === 0) {
        toast({
          title: "No items selected",
          variant: "destructive",
          description: "Please select items before proceeding to checkout.",
        });
        return;
      }
  
      // Collect checkout items first
      const checkoutItems = selected.map((item) => ({
        cart_id: item.cart_id,
        tbl_products: item.tbl_products,
        tbl_variants: item.tbl_variants,
        quantity: item.cart_item_quantity,
      }));
  
      // Dispatch in a separate step after render cycle
      setTimeout(() => {
        dispatch(clearCheckoutItem());
        checkoutItems.forEach((item) => dispatch(addCheckoutItem(item)));
        dispatch(calculateCheckoutTotal());
        router.push("/checkout");
        dispatch(setLoading()); // Stop loading when done
      }, 100); // Delay prevents update during render
  
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        variant: "destructive",
        description: "Encountered a server error, please try again.",
      });
    }
  }
  
  
  return (
    <div className="w-11/12 absolute bottom-5 left-4">
      {cartItems.length > 5 && (
        <div className="py-4 flex items-center justify-center">
          <Link
            className=" text-sm text-green-500 font-normal hover:underline"
            href={"/"}
          >
            See More ({cartItems.length - 2}) items{" "}
          </Link>
        </div>
      )}
      <div className="py-4 flex items-center justify-between">
        <h3 className="text-slate-500 font-semibold text-sm">Total</h3>
        <p className="text-slate-700 text-lg">{formatCurrency(total)}</p>
      </div>
      <Button
        onClick={handleCheckout}
        className={`w-full m-auto text-white ${
          loading && selected.length === 0 ? "opacity-55" : "opacity-100"
        }`}
        variant="default"
        disabled={loading || selected.length === 0}
      >
        {loading ? (
          <ButtonLoading text="Checking out..." />
        ) : (
          "Proceed To Checkout"
        )}
      </Button>
    </div>
  );
}
