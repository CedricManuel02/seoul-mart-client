import { IAccount } from "@/_interface/interface";
import React from "react";
import { useSelector } from "react-redux";
import NavigationLink from "./navigation-link";
import { auth } from "@/auth";
export default async function NavigationLinkContainer() {
  const session = await auth()
  return (
    <div className="hidden md:block">
      {" "}
      <div className="w-full bg-slate-100 py-4 flex items-center gap-6 justify-center text-sm">
        {session?.user && session.user.role === "ADMIN" ? (
          <React.Fragment>
            <NavigationLink
              link={"/dashboard"}
              text={"Dashboard"}
            />
            <NavigationLink
              link={"/product"}
              text={"Product"}
            />
            <NavigationLink
              link={"/orders"}
              text={"Orders"}
            />
            <NavigationLink
              link={"/categories"}
              text={"Categories"}
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <NavigationLink link={"/"} text={"Home"} />
            <NavigationLink
              link={"/products"}
              text={"Products"}
            />
            <NavigationLink
              link={"/#about"}
              text={"About Us"}
            />
             <NavigationLink
              link={"/policy"}
              text={"Store Policy"}
            />
          </React.Fragment>
        )}
        
      </div>
      {/* {session && session.user?.role === "ADMIN" && (
        <NavigationDate/>
      )} */}
    </div>
  );
}
