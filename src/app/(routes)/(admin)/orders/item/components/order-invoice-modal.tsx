"use client";
import { MyDocument } from "@/_components/shared/invoice-pdf/invoice";
import { IOrders } from "@/_interface/interface";
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

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Download, Printer } from "lucide-react";
import React, { useState } from "react";

export default function OrderInvoiceModal({ order }: { order: IOrders }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 justify-center"
          variant={"outline"}
        >
          <Printer /> Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Invoice Receipt</DialogTitle>
          <DialogDescription>
            Here's the invoice receipt for the order.
          </DialogDescription>
        </DialogHeader>
        <PDFViewer className="w-full h-[550px] hidden lg:block">
          <MyDocument order={order} />
        </PDFViewer>
        <DialogFooter>
          <PDFDownloadLink
            document={<MyDocument order={order} />}
            fileName={`order-${order.order_number}.pdf`}
          >
            <Button className="w-full md:w-auto" variant={"destructive"}>
              <Download />
              Download
            </Button>
          </PDFDownloadLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
