import { startTransition, useOptimistic, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { updateCartServerAction } from "@/_action/(user)/cart";
import { incrementQuantity, decrementQuantity, calculateTotal, updateCheckoutItem } from "@/_redux/features/cart-slice";
import { calculateCheckoutTotal, updateCheckoutQuantity } from "@/_redux/features/checkout-slice";

export default function NavigationQuantity({ cart, loading }: { cart: any; loading: boolean }) {
  const dispatch = useDispatch();
  
  const [optimisticCart, setOptimisticCart] = useOptimistic(cart, (oldCart, newCart : any) => {
    return { ...oldCart, cart_item_quantity: newCart.cart_item_quantity };
  });

  async function handleIncrementQuantity(cart_id: string) {
    if (optimisticCart.cart_item_quantity < optimisticCart.tbl_variants.variant_stocks) {
      const newQuantity = optimisticCart.cart_item_quantity + 1;

      startTransition(() => {
        setOptimisticCart({ ...optimisticCart, cart_item_quantity: newQuantity });
      })
      
      try {
        await updateCartServerAction(cart.cart_id, newQuantity, "INCREMENT");
        dispatch(incrementQuantity({ cart_id }));
        dispatch(updateCheckoutQuantity({cart_id: cart_id, quantity: newQuantity}));
        dispatch(calculateCheckoutTotal());
        dispatch(updateCheckoutItem({ product_id: cart.tbl_products.product_id, quantity: newQuantity }));
        dispatch(calculateTotal());
      } catch (error) {
        toast({ description: "Failed to update quantity" });
        setOptimisticCart(cart);
      }
    }
  }

  async function handleDecrementQuantity(cart_id: string) {
    if (optimisticCart.cart_item_quantity > 1) {
      const newQuantity = optimisticCart.cart_item_quantity - 1;

      startTransition(() => {
        setOptimisticCart({ ...optimisticCart, cart_item_quantity: newQuantity });
      })
     
      try {
        await updateCartServerAction(cart.cart_id, newQuantity, "DECREMENT");
        dispatch(decrementQuantity({ cart_id }));
        dispatch(updateCheckoutQuantity({cart_id: cart_id, quantity: newQuantity}));
        dispatch(calculateCheckoutTotal());
        dispatch(updateCheckoutItem({ product_id: cart.tbl_products.product_id, quantity: newQuantity }));
        dispatch(calculateTotal());
      } catch (error) {
        toast({ description: "Failed to update quantity" });
        setOptimisticCart(cart);
      }
    }
  }


  


  return (
    <div className={`flex items-center gap-2 w-20 ${loading ? "opacity-80" : "opacity-100"}`}>
      <Button
        variant="outline"
        onClick={() => handleDecrementQuantity(cart.cart_id)}
        disabled={loading || optimisticCart.cart_item_quantity === 1}
      >
        -
      </Button>
      <Input
        className="w-14 text-center"
        type="text"
        value={optimisticCart.cart_item_quantity}
        readOnly
        disabled={loading}
      />
      <Button
        variant="outline"
        onClick={() => handleIncrementQuantity(cart.cart_id)}
        disabled={loading || optimisticCart.cart_item_quantity === optimisticCart.tbl_variants.variant_stocks}
      >
        +
      </Button>
    </div>
  );
}
