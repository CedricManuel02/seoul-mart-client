import CategoryCarousel from "@/_components/category-carousel/category-carousel";
import ProductContainer from "@/_components/product/product-container";
import AboutContainer from "@/_components/about/about";
import Hero from "@/_components/hero/page";
export default function Home() {
 
  return (
    <div className="w-11/12 xl:w-9/12 m-auto py-2 h-auto">
      {/* This is the hero section */}
      <Hero/>
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
