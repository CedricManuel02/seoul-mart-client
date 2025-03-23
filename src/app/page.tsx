import Image from "next/image";
import HeroImage from "@/_assets/hero.png";
import { Button } from "@/components/ui/button";
import CategoryCarousel from "@/_components/category-carousel/category-carousel";
import ProductContainer from "@/_components/product/product-container";
import AboutContainer from "@/_components/about/about";
export default function Home() {
 
  return (
    <div className="w-11/12 xl:w-9/12 m-auto py-2 h-auto">
      {/* This is the hero section */}
      <div className="bg-slate-100 px-8 py-14 h-auto rounded-lg flex items-center justify-between">
        {/* This is the hero description section */}
        <div className="w-full lg:w-6/12">
          <h1 className="py-2 text-slate-700 text-xl md:text-2xl lg:text-4xl font-bold">
            A Warm Welcome to Bella &{" "}
            <span className="text-green-500">Pepper’s</span> Taste of Korea
          </h1>
          <p className="text-slate-500 py-4 text-sm">
            Authentic Korean Beverages & Cuisine – Indulge in the Rich Flavors
            of Korea with Our Selection of Traditional Drinks, Savory Dishes,
            and Sweet Treats. From Refreshing Korean Teas to Classic Delicacies,
            Experience a Taste of Korea in Every Sip and Bite!
          </p>
          <Button className="font-semibold bg-green-500 hover:bg-green-600">
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
      {/* About Section */}
      <AboutContainer />
      {/* Categories Section Carousel */}
      <CategoryCarousel />
      {/* Product Section */}
      <ProductContainer text={"Noodles"} url={"/category/Noodles"} />
      {/* Product Section */}
      <ProductContainer text={"Snacks"} url={"/category/Snacks"} />
      {/* Product Section */}
      <ProductContainer text={"Drinks"} url={"/category/Drinks"} />
    </div>
  );
}
