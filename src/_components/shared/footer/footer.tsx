import Image from "next/image";
import React from "react";
import logo from "@/_assets/logo.png";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
export default function Footer() {
  return (
    <div className="w-full bg-slate-100" >
      <div className="w-full xl:w-10/12 m-auto">
        <footer className="footer text-base-content border-t px-10 py-4">
          <aside className="grid-flow-col items-center">
            <Image
              src={logo}
              alt="logo"
              width={50}
              height={50}
              loading="lazy"
            />
            <p className="font-medium text-slate-700">
              Seoul <span className="text-green-500">Store's</span>
              <br />
              <span className="text-slate-500">Providing quality korean food and beverages</span>
              <br />
              <span className="text-slate-500">Created by <Link className="text-green-500" href={"/"}>@cedricmanuel</Link></span>
            </p>
          </aside>
          <nav className="md:place-self-center md:justify-self-end">
            <div className="flex items-center justify-start gap-2">
              <Link href={"#"}>
                <TwitterIcon className="text-green-600 hover:text-green-600" />
              </Link>
              <Link href={"#"}>
                <FacebookIcon className="text-green-600 hover:text-green-600" />
              </Link>
              <Link href={"#"}>
                <InstagramIcon className="text-green-600 hover:text-green-600" />
              </Link>
            </div>
          </nav>
        </footer>
      </div>
    </div>
  );
}
