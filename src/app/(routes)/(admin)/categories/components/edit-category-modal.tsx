"use client";
import { updateCategoryServerAction } from "@/_action/(admin)/categories";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { ACCEPTED_IMAGE_TYPES } from "@/_constant/constant";
import { ICategory } from "@/_interface/interface";
import { formUpdateCategorySchema } from "@/_zod-schema/zod-schema";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function EditCategoryModal({ category }: { category: ICategory }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formUpdateCategorySchema>>({
    resolver: zodResolver(formUpdateCategorySchema),
    defaultValues: {
      category_id: category.category_id,
      category_name: category.category_name,
      category_image: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formUpdateCategorySchema>) {
    try {
      setLoading(true);
      const response = await updateCategoryServerAction(values);
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
      console.error("Something went wrong while updating category, please try again:", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription className="text-red-400">Any changes to this product will change all the information related to it.</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-2">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel className="font-medium text-slate-500">Category</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_image"
                render={({ field }) => (
                  <FormItem className="w-full text-left">
                    <FormLabel className="font-medium text-slate-500">Upload Image</FormLabel>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Input
                          type="file"
                          accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                          }}
                        />
                      </FormControl>
                      <Image
                        src={category.category_image_url}
                        alt={category.category_name}
                        width={20}
                        height={20}
                        className="w-auto h-auto p-2 shadow-sm rounded-md"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button className="bg-green-500 hover:bg-green-600" type="submit">
                  {loading ? <ButtonLoading text={"Updating..."} /> : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
