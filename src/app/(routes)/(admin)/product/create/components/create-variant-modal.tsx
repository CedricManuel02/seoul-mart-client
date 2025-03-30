"use client";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/_constant/constant";
import { IVariantCreate } from "@/_interface/interface";
import { addVariant } from "@/_redux/features/variant-slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const createVariantFormSchema = z.object({
  variant_name: z.string().min(1, { message: "Variant name is required" }),
  variant_price: z.string().min(1, { message: "Variant price is required" }),
  variant_stocks: z
    .string()
    .min(1, { message: "Variant stocks must be 1 or greater" }),
  variant_image_url: z
    .instanceof(File, { message: "Variant image is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image file is too large",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Invalid image type",
    }),
});

export default function CreateVariantModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const loading = useSelector((state: { variant: IVariantCreate }) => state.variant.loading);
  const form = useForm<z.infer<typeof createVariantFormSchema>>({
    resolver: zodResolver(createVariantFormSchema),
    defaultValues: {
      variant_name: "",
      variant_price: "",
      variant_stocks: "",
      variant_image_url: undefined,
    },
  });

  async function createVariantOnSubmit(
    values: z.infer<typeof createVariantFormSchema>
  ) {
    const file = values.variant_image_url;

    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      dispatch(
        addVariant({
          variant: {
            variant_name: values.variant_name,
            variant_price: values.variant_price,
            variant_stocks: values.variant_stocks,
            variant_image_url: file,
          },
        })
      );
    };
    form.reset();
    setIsOpen(false);
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" variant={"outline"} disabled={loading}>
          Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Variant</DialogTitle>
          <DialogDescription>
            Fill in the details and click save to create a new variant.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="variant_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="flex items-center justify-between space-x-2">
                <FormField
                  control={form.control}
                  name="variant_price"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="variant_stocks"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Stocks</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter stocks"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
              
              <FormField
                control={form.control}
                name="variant_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  className="bg-green-500 hover:bg-green-700"
                  onClick={async () => {
                    const isValid = await form.trigger();
                    if (isValid) {
                      form.handleSubmit(createVariantOnSubmit)();
                    }
                  }}
                >
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
