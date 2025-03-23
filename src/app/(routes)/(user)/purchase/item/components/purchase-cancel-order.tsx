"use client";
import { z } from "zod";
import React, { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CancelledOrderReason } from "@/_types/enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { cancelledOrderServerAction } from "@/_action/(user)/order";
import { formCancelledOrderSchema } from "@/_zod-schema/zod-schema";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// ? DONE CLEAN CODE 
export default function PurchaseCancelOrder({ order_id }: { order_id: string }) {

  if(!order_id) return null;

  const [status, setStatus] = useState<{ open: boolean; loading: boolean }>({
    open: false,
    loading: false,
  });

  const form = useForm<z.infer<typeof formCancelledOrderSchema>>({
    resolver: zodResolver(formCancelledOrderSchema),
    defaultValues: {
      cancelled_reason: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formCancelledOrderSchema>) {
    try {
      setStatus((prev) => ({ ...prev, loading: true }));

      if (!values.cancelled_reason || !Object.values(CancelledOrderReason).includes(values.cancelled_reason)) {
        toast({ variant: "destructive", description: "Invalid cancellation reason" });
        return;
      }

      if (!order_id) {
        toast({ variant: "destructive", description: "Order ID is required" });
        return;
      }

      const response = await cancelledOrderServerAction({ reason: values.cancelled_reason, order_id: order_id });

      if (response.error) {
        toast({ variant: "destructive", description: response.error });
        return;
      }

      toast({ variant: "default", description: response.success || "Order cancelled successfully" });
      return;
    } catch (error) {
      console.error("Something went wrong while cancelling the order:", error);
      toast({ variant: "destructive", description: "Failed to cancel the order" });
    } finally {
      setStatus({ open: false, loading: false });
    }
  }

  return (
    <Dialog onOpenChange={(open) => setStatus((prev) => ({ ...prev, open }))} open={status.open}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 justify-center" variant={"destructive"}>
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>Are you sure you want to cancel this order?</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-2">
            <FormField
              control={form.control}
              name="cancelled_reason"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">What is the reason you want to cancel this order?</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value as CancelledOrderReason)} value={field.value} disabled={status.loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.values(CancelledOrderReason).map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant={"destructive"} type="submit" disabled={status.loading}>
                {status.loading ? <ButtonLoading text={"Processing..."} /> : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
