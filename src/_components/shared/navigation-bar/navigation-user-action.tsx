import { Separator } from "@/components/ui/separator";
import { auth } from "../../../auth";
import Link from "next/link";
import React from "react";
import NavigationCartSidebar from "../cart-sidebar/navigation-cart-sidebar";
import NavigationUserDropdown from "./navigation-user-dropdown";
import NavigationUserNotification from "./navigation-user-notification";
export default async function NavigationUserAction() {
  const session = await auth();
  return (
    <div>
      {session ? (
        <div className="flex items-center space-x-6">
          <NavigationUserNotification session={session}/>
          {session.user.role === "USER" && <NavigationCartSidebar />}
          <NavigationUserDropdown />
        </div>
      ) : (
        <section className="flex items-center justify-center space-x-4">
          <Link href={"/login"} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Login
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <Link href={"/register"} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Register
          </Link>
        </section>
      )}
    </div>
  );
}
