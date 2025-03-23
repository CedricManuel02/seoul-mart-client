"use client";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/_constant/constant";
import { IVariantCreate } from "@/_interface/interface";
import { updateVariant } from "@/_redux/features/variant-slice";
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";

const updateVariantFormSchema = z.object({
  variant_name: z.string().min(1, { message: "Variant name is required" }),
  variant_price: z.string().min(1, { message: "Variant price is required" }),
  variant_stocks: z
    .string()
    .min(1, { message: "Variant stocks must be 1 or greater" }),
  variant_image_url: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Image file is too large",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Invalid image type",
        }),
      z.null(),
      z.undefined(),
    ])
    .optional(),
});

export default function UpdateVariantModal({ index }: { index: number }) {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const variant = useSelector(
    (state: { variant: IVariantCreate }) => state.variant.variant
  );
  const loading = useSelector((state: { variant: IVariantCreate }) => state.variant.loading);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof updateVariantFormSchema>>({
    resolver: zodResolver(updateVariantFormSchema),
    defaultValues: variant[index]
      ? {
          variant_name: variant[index].variant_name || "",
          variant_price: variant[index].variant_price || "",
          variant_stocks: String(variant[index].variant_stocks) || "",
          variant_image_url: null,
        }
      : {},
  });

  // Function for updating the variant 
  async function updateVariantOnSubmit(
    values: z.infer<typeof updateVariantFormSchema>
  ) {
    setIsOpen(true);
  
    let updatedValues = {
      ...values,
      variant_image_url: values.variant_image_url || variant[index].variant_image_url, 
      variant_image: variant[index].variant_image, 
    };
  
    const file = values.variant_image_url;
  
    if (file instanceof File) {
      try {
        const base64String = await toBase64(file);
        updatedValues.variant_image = base64String;
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  
    dispatch(updateVariant({ index, values: updatedValues }));
  
    toast({
      description: "Successfully updated variant",
    });
  
    setIsOpen(false);
  }
  
  // 🔄 Convert File to Base64 (Helper function)
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full md:w-auto" variant="outline" disabled={loading}>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Variant</DialogTitle>
          <DialogDescription>
            Fill in the details and click update to update a variant.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateVariantOnSubmit)}>
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
                  <FormItem className="w-full">
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
                <Button type="button"
                  className="bg-green-500 hover:bg-green-700"
                  onClick={async () => {
                    const isValid = await form.trigger();
                    if (isValid) {
                      form.handleSubmit(updateVariantOnSubmit)();
                    }
                  }}>Update</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
