"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/_interface/interface";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { updateProductServerAction } from "@/_action/(admin)/variant";
import CreateVariantModal from "./create-variant-modal";
import CreateVariantList from "./create-variant-list";
import { toast } from "@/hooks/use-toast";
import { getCategoriesServerAction } from "@/_action/(admin)/categories";

const formsUpdateProduct = z.object({
  product_upc_number: z.string().min(1, { message: "Product UPC is required" }),
  product_name: z.string().min(1, { message: "Product name is required" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  product_description: z
    .string()
    .min(1, { message: "Description is required" }),
});

export default function UpdateForm(payload: any) {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const form = useForm<z.infer<typeof formsUpdateProduct>>({
    resolver: zodResolver(formsUpdateProduct),
    defaultValues: {
      product_upc_number: payload.product?.product_upc_number || "",
      product_name: payload.product?.product_name || "",
      category_id: payload.product?.category_id || "",
      product_description: payload.product?.product_description || "",
    },
  });

  async function handleProductUpdate(values: z.infer<typeof formsUpdateProduct>) {
    try {
      setLoading(true);
      const response = await updateProductServerAction({product_id: payload.product.product_id, product_data: values});
      if(response.status === 201) {
        toast({
          description: response.message
        })
      } else {
        toast({
          title: "Failed to update product",
          variant: "destructive",
          description: response.message
        })
      }
    } catch (error) { 
      console.error("Something went wrong", error);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    const category = async () => {
     const response = await getCategoriesServerAction();
      setCategories(response);
    };
    category();
  }, []);

  return (
    <div className={`${loading ? "opacity-80" : "opacity-100"} w-full lg:w-8/12 m-auto h-auto`}>
      {/* Form Product information */}
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col space-y-10">
            <div className="bg-white p-6 rounded-md shadow">
              <h3 className="font-semibold text-sm text-slate-900">
                Product Information
              </h3>
              <p className="text-slate-500 text-sm">
                Update your product that will be displayed in the shop
              </p>
              <FormField
                control={form.control}
                name="product_upc_number"
                render={({ field }) => (
                  <FormItem className="w-full py-2">
                    <FormLabel className="text-slate-700">UPC Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter product upc number"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="flex flex-wrap md:flex-nowrap items-center justify-between md:space-x-2">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem className="w-full py-2">
                      <FormLabel className="text-slate-700">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter product name"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem className="w-full py-2">
                      <FormLabel className="text-slate-700">Category</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                        defaultValue={payload.product?.product_id || ""}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.category_name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
              <FormField
                control={form.control}
                name="product_description"
                render={({ field }) => (
                  <FormItem className="w-full py-2">
                    <FormLabel className="text-slate-700">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product name"
                        className="min-h-32"
                        spellCheck={false}
                        {...field}
                        disabled={loading}
                      ></Textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Product Variant List */}
            <div className="bg-white py-4 p-6 rounded-md shadow">
              <div className="py-2 flex flex-col flex-start md:flex-row md:items-center md:justify-between">
                <div className="py-3">
                  <h3 className="font-semibold text-sm text-slate-900">
                    Product Variant
                  </h3>
                  <p className="text-slate-500 text-sm">
                    List of product variants related to this product
                  </p>
                </div>
                <CreateVariantModal product_id={payload.product.product_id}/>
              </div>
              <CreateVariantList variant={payload.product.tbl_variants} />
            </div>
            <div className="flex items-start justify-end space-x-2 py-4">
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    form.handleSubmit(handleProductUpdate)();
                  }
                }}
                className="bg-green-500 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? <ButtonLoading text="Updating..." /> : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
