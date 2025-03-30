"use client";
import Image from "next/image";
import HeroImage from "@/_assets/hero.png";
import { Button } from "@/components/ui/button";
import React from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <div className="bg-slate-100 px-8 py-14 h-auto rounded-lg flex items-center justify-between">
      {/* This is the hero description section */}
      <div className="w-full lg:w-6/12">
        <h1 className="py-2 text-slate-700 text-xl md:text-2xl lg:text-4xl font-bold">
          A Warm Welcome to <span className="text-green-500">Seoul Mart's</span>{" "}
          Taste of Korea
        </h1>
        <p className="text-slate-500 py-4 text-sm">
          Authentic Korean Beverages & Cuisine – Indulge in the Rich Flavors of
          Korea with Our Selection of Traditional Drinks, Savory Dishes, and
          Sweet Treats. From Refreshing Korean Teas to Classic Delicacies,
          Experience a Taste of Korea in Every Sip and Bite!
        </p>
        <Button onClick={() => router.push("/products")} className="font-semibold bg-green-500 hover:bg-green-600">
          Shop Now!
        </Button>
      </div>
      {/* This is the image section */}
      <div className="h-full hidden w-5/12 lg:block">
        <Image
          src={HeroImage}
          alt="image"
          width={500}
          height={500}
          priority={true}
        />
      </div>
    </div>
  );
}
