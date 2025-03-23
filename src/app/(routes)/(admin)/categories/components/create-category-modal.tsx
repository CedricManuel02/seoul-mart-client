"use client";
import { createCategoryServerAction } from "@/_action/(admin)/categories";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { ACCEPTED_IMAGE_TYPES } from "@/_constant/constant";
import { formCreateCategorySchema } from "@/_zod-schema/zod-schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateCategoryModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formCreateCategorySchema>>({
    resolver: zodResolver(formCreateCategorySchema),
    defaultValues: {
      category_name: "",
      category_image: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formCreateCategorySchema>) {
    try {
      setLoading(true);
      const response = await createCategoryServerAction(values);
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
      console.error("Something went wrong while creating category, please try again:", error);
    } finally {
      form.reset();
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 justify-center text-slate-500" variant={"outline"}>
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Create a category for the product that can be displayed through the list of categories.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-2">
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">Upload Image</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className="bg-green-500 hover:bg-green-600" type="submit">
                {loading ? <ButtonLoading text={"Creating..."} /> : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
