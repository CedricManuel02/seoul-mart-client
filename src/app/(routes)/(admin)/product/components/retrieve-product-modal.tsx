"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { retrieveProductServerAction } from "@/_action/(admin)/product";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { RotateCcw } from "lucide-react";

export default function RetrieveProductModal({ product_id }: { product_id: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  async function onClick(product_id: string) {
    try {
      setLoading(true);
      const response = await retrieveProductServerAction(product_id);
      if (response.error) {
        toast({
          variant: "destructive",
          description: response.error,
        });
        return;
      }
      toast({
        description: response.success,
      });
    } catch (error) {
      console.error("Something went wrong while deleting product:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(false);
      }, 5000);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} onClick={() => setOpen(true)}>
          <RotateCcw/>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This will retrieve the product and will be available to the shop</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={() => onClick(product_id)} disabled={loading}>
            {loading ? <ButtonLoading text={"Retrieving..."} /> : "retrieve"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
