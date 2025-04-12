"use client";
import { Bell, BellRing } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_ICON_SIZE } from "@/_constant/constant";
import socket from "@/lib/socket";
import { toast } from "@/hooks/use-toast";
import { getNotificationsServerAction, markNotificationsAsReadServerAction } from "@/_action/(admin)/notification";
import { INotifications } from "@/_interface/interface";
import { formatNotificationDate } from "@/_utils/helper";
import NavigationNotificationIcon from "./navigation-notification-icon";
import Link from "next/link";

export default function NavigationUserNotification({ session }: { session: any }) {
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const getNotifications = async () => {
    try {
      const response = await getNotificationsServerAction();

      if(response) {
        setNotifications(response);
        // Count unread notifications
        const unread = response.filter((notif: INotifications) => !notif.notifications_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark notifications as read
  const handleReadNotifications = async () => {
    if (unreadCount > 0) {
      try {
        const response = await markNotificationsAsReadServerAction();
        if(response === 200) {
          setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, notifications_read: true }))
          );
          setUnreadCount(0); 
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;

    // Establish socket connection
    socket.emit("user_connected", { userId: session.user.id });

    // Listen for new notifications
    socket.on("receive_notification", () => {
      toast({ description: `Received a new notification` });
      getNotifications();
    });
 
    return () => {
      socket.off("receive_notification");
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (session) {
      getNotifications();
    }
  }, [session]);


  const getNotificationLink = (notifications: INotifications) => {
    if(notifications.order_id) return session.user.role === "ADMIN" ? `/orders/item/${notifications.order_id}` : `/purchase/item/${notifications.order_id}`;
    if(notifications.product_id) return  session.user.role === "ADMIN" ? `/product/update/${notifications.order_id}` : `/purchase/item/${notifications.order_id}`; ;

    return "";
  }
  return (
    <DropdownMenu onOpenChange={handleReadNotifications}>
      {/* Drop-down Button */}
      <DropdownMenuTrigger className="outline-none" asChild>
        <div className="relative">
          {unreadCount > 0 && (
            <span className="rounded-full h-4 w-4 text-xs absolute top-[-6px] right-[-4px] text-center bg-green-400 text-white font-medium">
              {unreadCount}
            </span>
          )}
          <Bell
            size={DEFAULT_ICON_SIZE}
            className="text-slate-500 cursor-pointer hover:text-slate-700"
          />
        </div>
      </DropdownMenuTrigger>
      
      {/* Drop-down Content */}
      <DropdownMenuContent className="w-80 border-none shadow-md mt-5 mr-5">
        <h3 className="p-2 text-slate-700 font-medium">Notifications</h3>
        <DropdownMenuSeparator />
        <div className="max-h-44 overflow-x-hidden overflow-y-scroll custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notification: INotifications) => (
              <Link href={getNotificationLink(notification)}
                key={notification.notifications_id}
                className={`${
                  notification.notifications_read ? "bg-white" : "bg-slate-100"
                } flex items-start gap-2 p-2 rounded hover:bg-slate-100`}
              >
                <div className="flex items-center justify-center bg-slate-200 p-1 rounded-full">
                  <NavigationNotificationIcon status={notification.status} />
                </div>
                <div>
                  <h3 className="text-xs font-medium">{notification.notifications_title}</h3>
                  <small className="text-xs text-slate-500">
                    {formatNotificationDate(notification.notifications_date_created)}
                  </small>
                  <p className="text-xs text-slate-500">{notification.notifications_body}</p>
                  <DropdownMenuSeparator />
                </div>
              </Link>
            ))
          ) : (
            <div className="h-20 flex items-center justify-center gap-2 text-slate-400 text-sm">
              <BellRing size={DEFAULT_ICON_SIZE} />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
        <DropdownMenuLabel className="text-slate-500 text-xs font-normal text-center">
          End of notifications
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
