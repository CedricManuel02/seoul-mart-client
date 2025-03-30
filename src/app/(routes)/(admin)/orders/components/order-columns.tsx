"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { IOrders } from "@/_interface/interface"
import { formatCurrency, formatDate } from "@/_utils/helper";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<IOrders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "order_number",
    header: () => <div className="text-left">Order Number</div>,
    cell: ({ row }) => {
      return (
        <p>#{row.getValue("order_number")}</p>
      );
    },
  },
  {
    accessorKey: "tbl_users",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Customer <ArrowUpDown size={15} /></div>,
    cell: ({ row }) => {
      const user = row.getValue("tbl_users") as { user_email: string, user_profile: string, user_name: string };
      return (
        <div className="flex items-center space-x-2">
          <div>
            <Avatar className="w-6 h-6">
                <AvatarImage src={user.user_profile ? user.user_profile : `https://api.dicebear.com/9.x/initials/svg?seed=${user.user_name}}`}/>
                <AvatarFallback>{user.user_name}</AvatarFallback>
            </Avatar>
          </div>
          <p>{user.user_email}</p>
        </div>
      );
    }
  }
  ,
  {
    accessorKey: "tbl_items",
    header: "Price",
    cell: ({ row }) => {

      const items = row.getValue("tbl_items") as { item_quantity: number, item_product_price_at_time_purchase: number }[];

      const sum = items.reduce((acc, item) => acc + (item.item_quantity * item.item_product_price_at_time_purchase), 0);

      return <div>{formatCurrency(sum)}</div>;
    },
  }, {
    accessorKey: "tbl_order_status",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status <ArrowUpDown size={15} /></div>,
    cell: ({ row }) => {
      const status = row.getValue("tbl_order_status") as { status: string }[];
      const status_type = status[0].status.replace("_", " ")

      switch (status_type) {
        case "PAID":
          return <Badge className="bg-green-100 font-normal text-green-500 hover:bg-green-100">{status_type}</Badge>;
        case "CANCELLED":
          return <Badge className="bg-red-100 font-normal text-red-500 hover:bg-red-100">{status_type}</Badge>;
        case "REFUNDED":
          return <Badge className="bg-orange-100 font-normal text-orange-500 hover:bg-orange-100">{status_type}</Badge>;
        case "DELIVERED":
          return <Badge className="bg-blue-100 font-normal text-blue-500 hover:bg-blue-100">{status_type}</Badge>;
      }
    }
  }, {
    accessorKey: "order_target_date_received",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Priority <ArrowUpDown size={15} /></div>,
    cell: ({ row }) => {
      const target_date = row.getValue("order_target_date_received") as string;
      const now = new Date();
      const targetDate = new Date(target_date.replace(" ", "T"));
    
      const diffInMs = targetDate.getTime() - now.getTime();
    
      const millisecondsInADay = 1000 * 60 * 60 * 24;
      const remaining_days = Math.ceil(diffInMs / millisecondsInADay);

     if(remaining_days < 3) {
       return <Badge className="bg-red-100 font-normal text-red-500 hover:bg-red-100">High</Badge>;
     } else if (remaining_days <= 3){
      return <Badge className="bg-yellow-100 font-normal text-yellow-500 hover:bg-yellow-100">Medium</Badge>;
     } else {
      return <Badge className="bg-green-100 font-normal text-green-500 hover:bg-green-100">Low</Badge>;
     }
    }
  }, {
    accessorKey: "order_date_created",
    header: "Date Ordered",
    cell: ({ row }) => {
      return <div>{formatDate(row.getValue("order_date_created"))}</div>;
    }
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const payment_intent_id = row.original.tbl_order_payment.payment_intent_id;
      const order_id = row.original.order_id;
      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(payment_intent_id);
                  toast({
                    title: "Payment intent copied",
                    variant: "default",
                    description: "Payment intent has been copied to clipboard",
                  });
                }}
              >
                Copy Payment Intent
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/orders/item/${order_id}`}><DropdownMenuItem>View</DropdownMenuItem></Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
];
