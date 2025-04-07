import Image from "next/image";
import React from "react";
import Logo from "@/_assets/logo.png";
import NavigationSearch from "./navigation-search";
import Link from "next/link";
import NavigationUserAction from "./navigation-user-action";
import NavigationBarContainer from "./navigation-bar-container";
export default function NavigationBar() {
  return (
    <nav className="w-full py-2 shadow-md">
      <section className="flex items-center justify-between w-11/12 xl:w-9/12 h-full m-auto">
        <Link href={"/"} className="flex items-center space-x-4">
          <Image src={Logo} alt="Seoul Mart Korean Logo" className="w-auto h-auto object-contain" width={40} height={40} loading="lazy" />
          <h3 className="font-semibold hidden md:block">Seoul Mart</h3>
        </Link>
        {/* Navigation Bar Search */}
        <NavigationSearch />
        <NavigationBarContainer>
          {/* User Action */}
          <NavigationUserAction />
        </NavigationBarContainer>
      </section>
    </nav>
  );
}
