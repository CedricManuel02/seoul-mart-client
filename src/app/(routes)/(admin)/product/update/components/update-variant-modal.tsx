"use client"
import { updateVariantServerAction } from "@/_action/(admin)/variant";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/_constant/constant";
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
    .optional()
});

export default function UpdateVariantModal({variant_id, variant_data,}: {variant_id: string; variant_data: any;}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof updateVariantFormSchema>>({
    resolver: zodResolver(updateVariantFormSchema),
    defaultValues: {
      variant_name: variant_data.variant_name || "",
      variant_price: variant_data.variant_price || "",
      variant_stocks: String(variant_data.variant_stocks) || "",
      variant_image_url: null,
    },
  });

  async function updateVariantOnSubmit(values: z.infer<typeof updateVariantFormSchema>) {
    try {
      setLoading(true);
      const response = await updateVariantServerAction({variant_id: variant_id, variant_data: values});

      if(response.error) {
        toast({
          variant: "destructive",
          description: response.error
        });

        return;
      }
      toast({
        description: response.success
      });
    } catch (error) {
      console.error("Something went wrong while updating variant:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!variant_id) {
    return (
      <div>
        <h1>Variant ID is required</h1>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
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
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700"
                >
                  {loading ? <ButtonLoading text="Updating" /> : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
