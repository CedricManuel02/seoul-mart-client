"use server";
import React from "react";
import { ShoppingBag, ShoppingBasket } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DEFAULT_ICON_SIZE } from "@/_constant/constant";
import NavigationCartList from "./navigation-cart-list";
import NavigationCartFooter from "./navigation-cart-footer";
import { getCartServerAction } from "@/_action/(user)/cart";
export default async function NavigationCartSidebar() {
  const cart = await getCartServerAction();
  return (
    <Sheet>
      <SheetTrigger>
        <div className="relative">
          <span className="rounded-full h-4 w-4 text-xs absolute top-[-6px] right-[-4px] bg-green-400 text-white font-medium">{cart.length}</span>
          <ShoppingBag size={DEFAULT_ICON_SIZE} className="text-slate-500 cursor-pointer hover:text-slate-700" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-full">
        <SheetHeader className="text-left">
          <SheetTitle>My Cart {cart.length}</SheetTitle>
          <SheetDescription>Recently added products.</SheetDescription>
        </SheetHeader>
        {cart.length > 0 ? (
          <NavigationCartList cart={cart} />
        ) : (
          <div className="w-full h-96 flex flex-col items-center justify-center">
            <ShoppingBasket size={60} className="text-slate-500" />
            <h3 className="text-slate-700">Your cart is empty</h3>
            <p className="text-xs text-center text-slate-400">Looks like you have not added anything to your cart. Go ahead & explore top products</p>
          </div>
        )}
        <NavigationCartFooter />
      </SheetContent>
    </Sheet>
  );
}
