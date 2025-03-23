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
import { retrieveCategoryServerAction } from "@/_action/(admin)/categories";
import { toast } from "@/hooks/use-toast";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
export default function RetrieveCategoryModal({ category_id }: { category_id: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [isRetrieveOpen, setIsRetrieveOpen] = useState<boolean>(false);

  async function retrieveCategory(category_id: string) {
    try {
      setLoading(true);
      setIsRetrieveOpen(true);
      const response = await retrieveCategoryServerAction({ category_id });

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
      console.error("Something went wrong while retrieving category, please try again:", error);
    } finally {
      setLoading(false);
      setIsRetrieveOpen(false);
    }
  }

  return (
    <Dialog open={isRetrieveOpen} onOpenChange={setIsRetrieveOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"secondary"}>
          Retrieve
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This will retrieve the category</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"outline"} disabled={loading}>
              Close
            </Button>
          </DialogClose>
          <Button onClick={() => retrieveCategory(category_id)} type="button" variant={"destructive"} disabled={loading}>
            {loading ? <ButtonLoading text={"Retrieving..."} /> : <p>Yes, Retrieve!</p>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
