import { receivedOrderServerAction } from "@/_action/(user)/order";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import socket from "@/lib/socket";
import React from "react";

export default function PurchaseOrderReceivedModal({ order_id }: { order_id: string }) {

  if(!order_id) return null;

  async function handleReceivedOrder() {
    try {
      const response = await receivedOrderServerAction({ order_id });

      if (response.error) {
        toast({ description: response.error });
        return;
      }

      toast({ description: response.success });
      socket.emit("user_send_notification");
    } catch (error) {
      console.error("Something went wrong while processing the order receive:", error);
      toast({variant: "destructive", description: "Failed to process receiving order, please try again later"});
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Order Received</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Did you receive the order?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500 hover:bg-red-400" onClick={handleReceivedOrder}>
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
