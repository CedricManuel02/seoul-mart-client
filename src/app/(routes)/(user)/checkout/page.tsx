"use client";
import { ICheckoutArray } from "@/_interface/interface";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckoutProductList from "./components/checkout-product-list";
import CheckoutForm from "./components/checkout-form";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { resetShippingFee } from "@/_redux/features/checkout-slice";
import CheckoutMapContainer from "./components/checkout-map-container";

export default function Checkout() {
  const redirect = useRouter();
  const dispatch = useDispatch();
  dispatch(resetShippingFee());
  const checkout = useSelector(
    (state: { checkout: ICheckoutArray }) => state.checkout.item
  );

  return (
    <div className="min-h-screen w-full bg-slate-50">
      {checkout.length > 0 ? (
        <div className="w-11/12 xl:w-9/12 h-full m-auto py-10 flex gap-10 lg:items-start justify-center flex-col-reverse lg:flex-row">
          <div className="flex flex-col w-full lg:w-7/12 gap-2">
            <CheckoutMapContainer />
            <CheckoutForm />
          </div>
          <CheckoutProductList />
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col space-y-2 items-center justify-center">
          <ShoppingBasket size={60} className="text-slate-500" />
          <h3 className="text-md font-medium text-slate-700">
            Your cart is empty
          </h3>
          <p className="text-sm text-center text-slate-400">
            Looks like you have not added anything to your cart. Go ahead &
            explore top products
          </p>
          <Button
            className="bg-green-500 hover:bg-green-700"
            variant={"default"}
            onClick={() => redirect.push("/products")}
          >
            Continue Shipping
          </Button>
        </div>
      )}
    </div>
  );
}
