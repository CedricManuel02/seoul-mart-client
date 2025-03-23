import React from "react";
import Header from "../shared/container-header/header";
import CategoryCarouselContainer from "./category-carousel-container";
import CategoryCarouselCard from "./category-carousel-card";


export default function CategoryCarousel() {

  return (
    <div className="py-5">
      <Header text={"Popular Categories"} url={"/products"} />
      <CategoryCarouselContainer>
        <CategoryCarouselCard/>
      </CategoryCarouselContainer>
    </div>
  );
}
