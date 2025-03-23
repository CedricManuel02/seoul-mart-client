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
import { LoaderCircle } from "lucide-react";
import { DEFAULT_ICON_SIZE } from "@/_constant/constant";
import {  retrieveVariantServerAction } from "@/_action/(admin)/variant";
import { useToast } from "@/hooks/use-toast";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";

export default function RetrieveVariantModal({ variant_id }: { variant_id: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false); 

  async function retrieveVariantOnClick(variant_id: string) {
    try {
      setLoading(true);
     const response =  await retrieveVariantServerAction(variant_id);
     if(response.status === 202){
      toast({
        description: "Successfully retrieved variant"
      })
     } else {
      toast({
        description: "Failed to retrieved variant"
      })
     }
    } catch (err) {
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
        <Button variant="outline" onClick={() => setOpen(true)}>
          Retrieve Variant
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will retrieve the variant and it will be available to the shop.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={() => retrieveVariantOnClick(variant_id)} disabled={loading}>
            {loading ? (
              <ButtonLoading text={"Retrieving..."}/>
            ) : (
              "Retrieve"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
