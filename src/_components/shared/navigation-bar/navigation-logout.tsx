import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import React from "react";
import { signOut } from "@/auth";
import { SignoutServerAction } from "@/_action/(shared)/login";

export default function NavigationLogout() {
  return (
    <form
      action={async () => {
        "use server";
        await SignoutServerAction();
        await signOut();
      }}
    >
      <Button
        variant={"link"}
        className="flex items-center justify-start w-full p-0 text-sm text-slate-900 font-normal h-6 hover:no-underline"
        type="submit"
      >
        <LogOut className="mr-2 h-4 w-4 text-slate-700" />
        Log out
      </Button>
    </form>
  );
}
