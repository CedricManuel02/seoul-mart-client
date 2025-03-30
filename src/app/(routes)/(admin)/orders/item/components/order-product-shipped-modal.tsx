"use client";
import { IOrders, IOrderStatus, IOrderStatusImages } from "@/_interface/interface";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import React, { useState } from "react";

export default function OrderProductShippedModal({ order }: { order: IOrders }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 justify-center" variant={"outline"}>
          View Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Shipped Image</DialogTitle>
          <DialogDescription>
            Here's the images of the product you shipped to the customer.
          </DialogDescription>
        </DialogHeader>
        <div  className="flex items-center gap-2 ">
          {order.tbl_order_status
            .filter((item: IOrderStatus) => item.status === "SHIPPED")
            .flatMap((item: IOrderStatus) => item.tbl_order_status_images)
            .map((status_images: IOrderStatusImages, index: number) => (
              <div key={index} className="border rounded">
                <Image
                  src={status_images.order_status_image}
                  alt="Shipped Image"
                  width={100}
                  height={100}
                  className="rounded-lg h-32 w-32 object-contain"
                />
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
