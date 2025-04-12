"use client";
import { createRatingServerAction } from "@/_action/(user)/order";
import { ACCEPTED_IMAGE_TYPES, DEFAULT_ICON_SIZE } from "@/_constant/constant";
import { IItems, IOrders, IRating } from "@/_interface/interface";
import { formRateOrderSchema } from "@/_zod-schema/zod-schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function PurchaseRatingModal({ order }: { order: IOrders }) {

  if (!order) return null;

  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<{ open: boolean; loading: boolean }>({
    open: false,
    loading: false,
  });

  const form = useForm<z.infer<typeof formRateOrderSchema>>({
    resolver: zodResolver(formRateOrderSchema),
    defaultValues: {
      order_rating: 0,
      variant_id: "",
      order_rating_text: "",
      order_rating_image: [],
    },
  });

  // FUNCTION FOR SUBMITTING RATING TO A PRODUCTS THAT ORDER
  async function onSubmit(values: z.infer<typeof formRateOrderSchema>) {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));

      if (values.order_rating > 5 || values.order_rating < 1) {
        toast({
          variant: "destructive",
          description: "Invalid rating",
        });
        return;
      }

      const response = await createRatingServerAction({ values, order_id: order.order_id });

      if (response.error) {
        toast({ variant: "destructive", description: response.error });
        return;
      }

      toast({ title: "Thank you for your feedback", description: (<div className="flex items-center gap-2"><Star className="text-yellow-yellow"/><p>{response.success}</p></div>) });
      socket.emit("user_send_notification");
    } catch (error) {
      console.error("Something went wrong while submitting rating", error);
      toast({ variant: "destructive", description: "Something went wrong while submitting your rating, please try again later" });
    } finally {
      setStatus({ loading: false, open: false });
    }
  }

  // FUNCTION WITH USE CALLBACK HOOK FOR START RATING
  const handleRatingOnClick = useCallback((star: number) => {
    setRating(star);
    form.setValue("order_rating", star);
  }, [form])

  return (
    <Dialog open={status.open} onOpenChange={(open) => setStatus((prev) => ({ ...prev, open }))}>
      <DialogTrigger asChild>
        <Button variant="outline">Rate</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Product Rating</DialogTitle>
          <DialogDescription>Hi! We hope you like our products. Please leave a rating. Thank you!</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="order_rating"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="flex items-center justify-center gap-5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={30}
                          onClick={() => handleRatingOnClick(star)}
                          className={`cursor-pointer transition ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variant_id"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">Product you want to rate</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={status.loading || rating === 0}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select products" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {order.tbl_items.map((item: IItems) =>
                            !order.tbl_rating.some(
                              (rating: IRating) => rating.order_id === item.order_id && item.variant_id === rating.variant_id
                            ) ? (
                              <SelectItem key={item.item_id} value={item.variant_id}>
                                {item.item_product_name}, {item.item_variant_name}
                              </SelectItem>
                            ) : null
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order_rating_image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">Upload Image (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                      }}
                      disabled={status.loading || rating === 0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order_rating_text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">Comment (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-32" placeholder="Enter your comment" {...field} value={field.value ?? ""}></Textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="destructive" type="submit" disabled={!form.formState.isValid || status.loading}>
                {status.loading ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
