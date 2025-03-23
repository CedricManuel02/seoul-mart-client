import React from "react";
import { KeyRound, ShoppingBag, User } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import NavigationLogout from "./navigation-logout";
import { auth } from "@/auth";

export default async function NavigationUserDropdown() {
  const session = await auth();
  return (
    <DropdownMenu>
      {/*This is the drop down button */}
      <DropdownMenuTrigger className="outline-none" asChild>
        {session && (
          <Avatar className="w-8 h-8 cursor-pointer hover:opacity-90">
            <AvatarImage
              src={session.user.image !== null ? `${session.user.image!}` : `https://api.dicebear.com/9.x/initials/svg?seed=${session.user.name}}`}
            />
          </Avatar>
        )}
      </DropdownMenuTrigger>
      {/*This is the drop down content */}
      <DropdownMenuContent className="w-56 border-none shadow-md mt-5 mr-5">
        <DropdownMenuLabel className="text-slate-700">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/profile"} className="flex items-center justify-center space-x-2">
            <User className="mr-2 h-4 w-4 text-slate-700" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={"/purchase"} className="flex items-center justify-center space-x-2">
            <ShoppingBag className="mr-2 h-4 w-4 text-slate-700" />
            <span>My Purchased</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <KeyRound className="mr-2 h-4 w-4 text-slate-700" />
          <span>Change Password</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <NavigationLogout />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
