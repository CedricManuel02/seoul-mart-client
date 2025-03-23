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
import { deleteVariantServerAction } from "@/_action/(admin)/variant";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { IVariantCreate } from "@/_interface/interface";
import { removeVariant } from "@/_redux/features/variant-slice";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";

export default function DeleteVariantModal({ index }: { index: number }) {
  const { toast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const loading = useSelector((state: { variant: IVariantCreate }) => state.variant.loading);

  async function deleteVariantOnClick() {
    try {
      dispatch(removeVariant(index));
      toast({
        description: "Successfully deleted variant",
      });
    } catch (err) {
    } finally {
        setOpen(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full md:w-auto" variant={"destructive"} onClick={() => setOpen(true)} disabled={loading}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the variant from the list.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <Button variant={"destructive"} onClick={deleteVariantOnClick} disabled={loading}>
            {loading ? (
             <ButtonLoading text="Deleting..."/>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
