"use client";
import { formatCurrency, formatDateWithTime, getRemainingDays } from "@/_utils/helper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
export default function OrderTable({ order }: { order: any }) {
  const router = useRouter();
  return (
    <Table className="whitespace-nowrap">
      {/* Table Header */}
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Purchased</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Date Ordered</TableHead>
          <TableHead>Remaining Days to Shipped</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      {/* Table Body */}
      <TableBody>
        {order && order.length > 0 && order.map((order: any) => (
          <TableRow key={order.order_id} className="text-slate-500 font-medium">
            <TableCell>
              {order.order_number}
            </TableCell>
           
            <TableCell>
              <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5 cursor-pointer hover:opacity-90">
                  <AvatarImage
                    src={
                      order.tbl_users.user_profile !== null
                        ? `${order.tbl_users.user_profile!}`
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${order.tbl_users.user_name}`
                    }
                  />
                </Avatar>
                <p>{order.tbl_users.user_email}</p>
              </div>
            </TableCell>
            <TableCell>
              <HoverCard>
                <HoverCardTrigger className="cursor-pointer hover:underline hover:text-green-500">
                  {order.tbl_items.length} Item Purchased
                </HoverCardTrigger>
                <HoverCardContent className="w-auto">
                  {order.tbl_items.map((item: any) => (
                    <div
                      key={item.item_id}
                      className="whitespace-nowrap font-medium flex py-2 items-center gap-2"
                    >
                      <Image
                        src={item.item_product_image}
                        alt="Variant Image"
                        className="h-auto w-auto"
                        width={40}
                        height={100}
                        loading="lazy"
                      />
                      <div>
                        <p className="text-xs">{item.item_product_name}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <p>
                            {item.item_variant_name}
                          </p>
                          <Separator className="h-3" orientation="vertical" />
                          <p>
                            {formatCurrency(
                              item.item_product_price_at_time_purchase
                            )}
                          </p>
                          <Separator className="h-3" orientation="vertical" />
                          <p>{item.item_quantity} Qty</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </HoverCardContent>
              </HoverCard>
            </TableCell>
          
            <TableCell>
              <p className="text-green-500 bg-green-100 w-14 text-center rounded text-sm">
                {order.tbl_order_status[0].tbl_status.status_name
                  .charAt(0)
                  .toUpperCase()}
                {order.tbl_order_status[0].tbl_status.status_name
                  .slice(1)
                  .toLowerCase()}
              </p>
            </TableCell>
            <TableCell>
              {formatCurrency(
                order.tbl_items.reduce(
                  (sum: number, item: any) =>
                    sum +
                    Number(item.item_product_price_at_time_purchase) *
                      Number(item.item_quantity),
                  0
                )
              )}
            </TableCell>
            <TableCell>
              {formatDateWithTime(order.order_date_created)}
            </TableCell>
            <TableCell>
              {getRemainingDays(order.order_target_date_received)}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2 justify-end">
                <Button onClick={() => router.push(`/orders/item/${order.order_id}`)} variant={"outline"}>View Order</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
