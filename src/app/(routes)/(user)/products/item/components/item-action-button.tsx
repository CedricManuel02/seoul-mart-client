"use client";
import { addToCartServerAction } from "@/_action/(user)/cart";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { IProduct, IVariants } from "@/_interface/interface";
import { clearSelectedItems } from "@/_redux/features/cart-slice";
import { addSingleCheckoutItem, calculateCheckoutTotal, clearCheckoutItem } from "@/_redux/features/checkout-slice";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, ShoppingBag, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

interface IItemActionButton {
  session: any;
  product: IProduct;
  variant: IVariants;
  product_id: string;
  selected_variant_id: string;
  item_quantity: number;
}

export default function ItemActionButton({ session, product, variant, product_id, selected_variant_id, item_quantity }: IItemActionButton) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingCheckout, setLoadingCheckout] = useState<boolean>(false);

  const handleAddingToCart = useCallback(
    async (product_id: string) => {
      try {
        setLoading(true);

        if (!session) {
          toast({
            title: "Login in to your account",
            variant: "destructive",
            description: "You should login to your account",
          });
          return;
        }

        const payload = { product_id, selected_variant_id, item_quantity };

        const response = await addToCartServerAction(payload);

        if (response.status !== 201) {
          toast({
            variant: "destructive",
            description: response.message,
          });

          return;
        }

        toast({
          variant: "default",
          description: (
            <div className="flex items-center justify-start gap-2">
              <CheckCircle2 className="text-green-500" />
              <p>{response.message}</p>
            </div>
          ),
        });
        dispatch(clearSelectedItems());
        dispatch(clearCheckoutItem());
        dispatch(calculateCheckoutTotal());
      } catch (error) {
        toast({
          title: "Something went wrong",
          description: "Something went wrong Please try again",
        });
      } finally {
        setLoading(false);
      }
    },
    [selected_variant_id, item_quantity]
  );

  const handleCheckingOut = useCallback(async () => {
    setLoadingCheckout(true);
    
    if (!session) {
      toast({
        title: "Login in to your account",
        variant: "destructive",
        description: "You should login to your account",
      });
      setLoadingCheckout(false);
      return;
    }

    dispatch(clearCheckoutItem());
    dispatch(addSingleCheckoutItem({ tbl_products: product, tbl_variants: variant, quantity: item_quantity }));

    setTimeout(() => {
      router.push("/checkout");
      setLoadingCheckout(false);
    }, 3000);
  }, [selected_variant_id, item_quantity]);
  return (
    <div className="my-4 flex flex-wrap items-center gap-2">
      <Button onClick={() => handleAddingToCart(product_id)} className="w-full md:w-auto" variant={"outline"} disabled={loading || loadingCheckout}>
        {loading ? <ButtonLoading text="Adding..." /> : <div className="flex items-center justify-center gap-2">
            <ShoppingBag size={14} />
            Add to Cart
          </div>}
      </Button>
      <Button
        onClick={handleCheckingOut}
        className="w-full md:w-auto bg-green-500 hover:bg-green-600"
        disabled={loading || loadingCheckout}
      >
        {loadingCheckout ? (
          <ButtonLoading text="Checking out..." />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart size={14} />
            Checkout
          </div>
        )}
      </Button>
    </div>
  );
}
