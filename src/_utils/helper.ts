import { IOrders } from "@/_interface/interface";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};
export const formatTransactionFee = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount / 100);
};
export function convertPriceToDiscount(price: number, discount: number) {
  const discounted = discount !== 0 ? price - (price * discount) / 100 : price;
  return formatCurrency(discounted);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
}
export function formatDateWithTime(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPHPhoneNumber(number: string) {
  if (number.startsWith("0")) {
    number = "+63" + number.slice(1);
  }

  return `(${number.slice(0, 3)}) ${number.slice(3)}`;
}

export function getRemainingDays(date: string) {
  const now = new Date();
  const targetDate = new Date(date.replace(" ", "T"));

  const diffInMs = targetDate.getTime() - now.getTime();

  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const remainingDays = Math.ceil(diffInMs / millisecondsInADay);

  return `${remainingDays} ${remainingDays > 1 ? "days" : "day"}`;
}

export function calculateProductTotal(order: IOrders) {
  const totalItems = order.tbl_items.reduce(
    (sum: number, item: any) =>
      sum +
      Number(item.item_product_price_at_time_purchase) *
        Number(item.item_quantity),
    0
  );
  const total = (totalItems + order.order_shipping_fee) - (order.tbl_order_payment.payment_transaction_fee / 100);
  return { total, totalItems };
}

export function formatNotificationDate(date: string) {
  const notificationDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)} minutes ago`; 
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 172800) {
    return "Yesterday"; 
  } else {
    return notificationDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

