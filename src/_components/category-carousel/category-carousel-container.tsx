"use client"
import React from "react"
import { Carousel, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
export default function CategoryCarouselContainer({ children }: any) {
    const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
    return (
        <Carousel plugins={[plugin.current]} className="w-full" onMouseEnter={plugin.current.stop} onMouseLeave={plugin.current.reset}>
            {children}
            <div className="hidden xl:block">
                <CarouselPrevious />
                <CarouselNext />
            </div>
        </Carousel>
    )
}
