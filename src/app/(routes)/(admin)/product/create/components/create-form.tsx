"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICategory, IVariantCreate } from "@/_interface/interface";
import CreateVariantModal from "./create-variant-modal";
import CreateVariantList from "./create-variant-list";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/hooks/use-toast";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { clearVariants, setLoading } from "@/_redux/features/variant-slice";
import { createProductServerAction } from "@/_action/(admin)/product";
import { getCategoriesServerAction } from "@/_action/(admin)/categories";

const formsUpdateProduct = z.object({
  product_upc_number: z.string().min(1, { message: "Product UPC is required" }),
  product_name: z.string().min(1, { message: "Product name is required" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  product_description: z.string().min(1, { message: "Description is required" }),
});

export default function CreateForm(payload: any) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const variant = useSelector((state: { variant: IVariantCreate }) => state.variant.variant);
  const loading = useSelector((state: { variant: IVariantCreate }) => state.variant.loading);

  const form = useForm<z.infer<typeof formsUpdateProduct>>({
    resolver: zodResolver(formsUpdateProduct),
    defaultValues: {
      product_upc_number: payload.product?.product_upc_number || "",
      product_name: payload.product?.product_name || "",
      category_id: payload.product?.category_id || "",
      product_description: payload.product?.product_description || "",
    },
  });

  const watchedFields = form.watch();
  const isFormEmpty = !watchedFields.product_name || !watchedFields.product_upc_number || !watchedFields.category_id || !watchedFields.product_description;
  async function onSubmit(values: z.infer<typeof formsUpdateProduct>) {
    try {
      const {product_upc_number, product_name, category_id, product_description} = values;
      dispatch(setLoading(true));

      if (variant.length === 0) {
        toast({
          title: "Zero variant listed",
          variant: "destructive",
          description: "Please add at least one variant for this product",
        });
        return;
      }

      const arrayOfImages: File[] = [];
      const variantsWithoutImage = variant.map(({ variant_image, variant_image_url, ...rest }) => {
        if (variant_image_url instanceof File) {
          arrayOfImages.push(variant_image_url);
        }
        return rest;
      });

      const formData = new FormData();

      formData.append("product_upc", product_upc_number);
      formData.append("product_name", product_name);
      formData.append("product_category", category_id);
      formData.append("product_description", product_description);
      formData.append("variants", JSON.stringify(variantsWithoutImage));

      arrayOfImages.forEach((image, index) => {
        formData.append(`variant_image[${index}]`, image);
      });

      const response = await createProductServerAction(formData);

      if(response.error) {
        toast({
          variant: "destructive",
          description: response.error
        });
        return;
      }

      toast({
          description: response.message,
      });
    } catch (error) {
      console.error("Something went wrong while creating products:", error);
    } finally {
      setTimeout(() => {
        form.reset();
        dispatch(clearVariants());
        dispatch(setLoading(false));
      }, 2000);
    }
  }

  function handleResetForm() {
    toast({
      title: "Reset Form",
      description: "Successfully reset the form",
    });
    form.reset();
    dispatch(clearVariants());
  }
  
  // Fetching the categories list from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategoriesServerAction();
      setCategories(response);
    };
    fetchCategories();
  }, []);
  return (
    <div className={`${loading ? "opacity-80" : "opacity-100"} w-full lg:w-8/12 m-auto h-auto`}>
      {/* Form Product information */}
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col space-y-10">
            <div className="bg-white p-6 rounded-md shadow">
              <h3 className="font-semibold text-sm text-slate-900">Product Information</h3>
              <p className="text-slate-500 text-sm">Create your product that will be displayed in the shop</p>
              <FormField
                control={form.control}
                name="product_upc_number"
                render={({ field }) => (
                  <FormItem className="w-full py-2">
                    <FormLabel className="text-slate-700">UPC Number</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter product upc number" {...field} disabled={loading} />
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
                        <Input type="text" placeholder="Enter product name" {...field} disabled={loading} />
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
                              <SelectItem key={category.category_id} value={category.category_id}>
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
                    <FormLabel className="text-slate-700">Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter product name" className="min-h-32" spellCheck={false} {...field} disabled={loading}></Textarea>
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
                  <h3 className="font-semibold text-sm text-slate-900">Product Variant</h3>
                  <p className="text-slate-500 text-sm">List of product variants related to this product</p>
                </div>
                <CreateVariantModal />
              </div>
              <CreateVariantList />
            </div>
            <div className="flex items-start justify-end space-x-2 py-4">
              <Button type={"button"} onClick={handleResetForm} variant={"outline"} disabled={loading || isFormEmpty}>
                Reset Form
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await form.trigger();
                  if (isValid) {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className="bg-green-500 hover:bg-green-700"
                disabled={loading || variant.length === 0 || isFormEmpty}
              >
                {loading ? <ButtonLoading text="Creating..." /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
