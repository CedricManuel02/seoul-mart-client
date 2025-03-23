"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteCategoryServerAction } from "@/_action/(admin)/categories";
import { toast } from "@/hooks/use-toast";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
export default function DeleteCategoryModal({ category_id }: { category_id: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  async function deleteCategory(category_id: string) {
    try {
      setIsOpen(true);
      setLoading(true);
      const response = await deleteCategoryServerAction({ category_id });

      if (response?.error) {
        toast({
          variant: "destructive",
          description: response.error,
        });
        return;
      }

      toast({
        description: response?.success,
      });
    } catch (error) {
      console.error("Something went wrong while deleting category, please try again:", error);
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"destructive"}>
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This will remove your category from the list.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"outline"} disabled={loading}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={() => deleteCategory(category_id)} type="button" variant={"destructive"} disabled={loading}>
            {loading ? <ButtonLoading text={"Deleting..."} /> : <p>Yes, Delete!</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
