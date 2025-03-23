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
import { deleteVariantServerAction } from "@/_action/(admin)/variant";
import { useToast } from "@/hooks/use-toast";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";

export default function DeleteVariantModal({ variant_id }: { variant_id: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); 

  async function onClick(variant_id: string) {
    try {
      setLoading(true);
     const response = await deleteVariantServerAction(variant_id);
     if(response.error) {
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
      console.error("Something went wrong while deleting variant:", error);
    } finally {
        setLoading(false);
        setOpen(false); 
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} onClick={() => setOpen(true)}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete the variant and not be available to the shop. You
            can retrieve this variant anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={() => onClick(variant_id)} disabled={loading}>
            {loading ? (
              <ButtonLoading text={"Deleting..."}/>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
