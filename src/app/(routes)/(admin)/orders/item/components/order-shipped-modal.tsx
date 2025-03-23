"use client";
import { createShippedServerAction } from "@/_action/(admin)/order";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { ACCEPTED_IMAGE_TYPES } from "@/_constant/constant";
import { formDeliverySchema } from "@/_zod-schema/zod-schema";
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
import { z } from "zod";
import socket from "@/lib/socket";
import { toast } from "@/hooks/use-toast";
export default function OrderShippedModal({
  order_number,
  user_id,
}: {
  order_number: string;
  user_id: string;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formDeliverySchema>>({
    resolver: zodResolver(formDeliverySchema),
    defaultValues: {
      delivery_company: "",
      tracking_number: "",
      delivery_rider_name: "",
      delivery_rider_phone: "",
      delivery_plate_number: "",
      item_image: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formDeliverySchema>) {
    try {
      setLoading(true);

      const response = await createShippedServerAction({
        order_number: order_number,
        shipped_details: values,
      });

      if (!user_id.trim()) {
        return toast({
          title: "Something went wrong",
          variant: "destructive",
          description: "User is not specified",
        });
      }

      if(response.status === 200) {
        socket.emit("send_notification", { recipientUserId: user_id });
      }
    } catch (error) {
      console.error("Something went wrong while logging in", error);
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 justify-center"
          variant={"destructive"}
        >
          Shipped Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Delivery Details</DialogTitle>
          <DialogDescription>
            Fill out the delivery details to let the user track the order
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-2"
          >
            <section className="flex flex-col md:flex-row items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="delivery_company"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-500">
                      Delivery Company
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter company name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tracking_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-500">
                      Tracking Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter tracking number"
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
              name="delivery_rider_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    Riders Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter riders name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <section className="flex flex-col md:flex-row items-center justify-between gap-2">
              <FormField
                control={form.control}
                name="delivery_rider_phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-500">
                      Contact
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter phone (+63)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="delivery_plate_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-medium text-slate-500">
                      Plate No.
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter vehicle plate number"
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
              name="item_image"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-medium text-slate-500">
                    Parcel Image (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        field.onChange(files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant={"destructive"} type="submit">
                {loading ? <ButtonLoading text={"Shipping..."} /> : "Shipped"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
