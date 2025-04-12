import { DEFAULT_ICON_SIZE } from "@/_constant/constant";
import { Truck, CheckCircle, CreditCard, Package, XCircle, PackageOpen, Star, MailWarning } from "lucide-react"; // Import icons

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PLACED ORDER":
      return <Package size={DEFAULT_ICON_SIZE} className="text-blue-500" />;
    case "PAID":
      return <CreditCard size={DEFAULT_ICON_SIZE} className="text-green-500" />;
    case "CONFIRMED":
      return <CheckCircle size={DEFAULT_ICON_SIZE} className="text-yellow-500" />;
    case "SHIPPED":
      return <Truck size={DEFAULT_ICON_SIZE} className="text-purple-500" />;
    case "DELIVERED":
      return <PackageOpen size={DEFAULT_ICON_SIZE} className="text-orange-500" />;
    case "CANCELLED":
      return <XCircle size={DEFAULT_ICON_SIZE} className="text-red-500" />;
    case "RATING":
      return <Star size={DEFAULT_ICON_SIZE} className="text-pink-500" />;
    case "VIOLATION":
      return <MailWarning size={DEFAULT_ICON_SIZE} className="text-red-500" />;
    default:
      return null;
  }
};

export default function NavigationNotificationIcon({ status }: { status: string }) {
  return <div>{getStatusIcon(status)}</div>;
}
