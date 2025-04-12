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
import { ICategory, IRating } from "@/_interface/interface";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { deleteRatingServerAction, updateProductServerAction } from "@/_action/(admin)/variant";
import CreateVariantModal from "./create-variant-modal";
import CreateVariantList from "./create-variant-list";
import { toast } from "@/hooks/use-toast";
import { getCategoriesServerAction } from "@/_action/(admin)/categories";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ItemCommentStarRating from "@/app/(routes)/(user)/products/item/components/item-comment-star-rating";
import { Badge } from "@/components/ui/badge";
import ItemCommentImageModal from "@/app/(routes)/(user)/products/item/components/item-comment-image-modal";
import { formatDate } from "@/_utils/helper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const formsUpdateProduct = z.object({
  product_upc_number: z.string().min(1, { message: "Product UPC is required" }),
  product_name: z.string().min(1, { message: "Product name is required" }),
  category_id: z.string().min(1, { message: "Category is required" }),
  product_description: z.string().min(1, { message: "Description is required" }),
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
      const response = await updateProductServerAction({ product_id: payload.product.product_id, product_data: values });
      if (response.status === 201) {
        toast({
          description: response.message,
        });
      } else {
        toast({
          title: "Failed to update product",
          variant: "destructive",
          description: response.message,
        });
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

  const handleDeleteRating = async (rating_id: string) => {
    try {
      const response = await deleteRatingServerAction(rating_id);
    } catch (error) {
      console.error("Something went wrong while deleting rating:", error);
    }
  };

  return (
    <div className={`${loading ? "opacity-80" : "opacity-100"} w-full lg:w-8/12 m-auto h-auto py-10`}>
      {/* Form Product information */}
      <div className="w-full">
        <Form {...form}>
          <form className="flex flex-col space-y-10">
            <div className="bg-white p-6 rounded-md shadow">
              <h3 className="font-semibold text-sm text-slate-900">Product Information</h3>
              <p className="text-slate-500 text-sm">Update your product that will be displayed in the shop</p>
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
                <CreateVariantModal product_id={payload.product.product_id} />
              </div>
              <CreateVariantList variant={payload.product.tbl_variants} />
            </div>
            {/* Rating */}
            <div className="bg-white py-4 p-6 rounded-md shadow">
              <div className="py-3">
                <h3 className="font-semibold text-sm text-slate-900">Product Rating</h3>
                <p className="text-slate-500 text-sm">List of user rating</p>
              </div>
              {payload.product.tbl_rating.length > 0 ? (
                <div className="flex flex-col gap-4 py-4">
                  {payload.product.tbl_rating.map((rating: any) => (
                    <div
                      key={rating.rating_id}
                      className={`${rating.rating_date_deleted ? "opacity-50" : "opacity-100"} p-2 flex items-start justify-between`}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8 cursor-pointer hover:opacity-90">
                          <AvatarImage
                            src={`${
                              rating.tbl_users.user_profile
                                ? rating.tbl_users.user_profile
                                : `https://api.dicebear.com/9.x/initials/svg?seed=${rating.tbl_users.user_name}`
                            }`}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-slate-700 text-sm font-medium">{rating.tbl_users.user_name}</h3>
                          <p className="text-slate-500 text-xs font-medium">{formatDate(rating.rating_date_created)}</p>
                          <div className="flex items-center gap-2">
                            <ItemCommentStarRating rating={rating.rating} />
                            <div className="flex items-center gap-2">
                              <Badge variant={"secondary"} className="text-xs font-medium">
                                {rating.tbl_variants.variant_name}
                              </Badge>
                              {rating.rating_date_deleted && (
                                <Badge variant={"destructive"} className="text-xs font-medium">
                                  Removed
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 py-2 w-full lg:w-7/12">{rating.rating_text}</p>
                          {rating.tbl_rating_media.length > 0 &&
                            rating.tbl_rating_media.map((media: any) => <ItemCommentImageModal key={media.media_id} media={media.media_path} />)}
                        </div>
                      </div>
                      {!rating.rating_date_deleted && (
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} className="p-2">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleDeleteRating(rating.rating_id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No Rating</div>
              )}
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
