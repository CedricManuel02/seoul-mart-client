import React from 'react'
import OrderInvoiceModal from './order-invoice-modal'
import { Button } from '@/components/ui/button'
import OrderShippedModal from './order-shipped-modal'
import { IOrders } from '@/_interface/interface'

export default function OrderActionButton({order}: {order: IOrders}) {
  return (
    <div className="py-4 w-full h-auto flex items-center justify-end space-x-2">
    <OrderInvoiceModal order={order} />
    {order.tbl_order_status.some(
      (status: any) => status.tbl_status.status_name === "SHIPPED"
    ) ? (
      <Button>test</Button>
    ) : (
      <OrderShippedModal order_number={order.order_number} user_id={order.tbl_users.user_id} />
    )}
  </div>
  )
}
