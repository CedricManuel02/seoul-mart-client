import { Star } from "lucide-react";
import React from "react";

export default function ProductStarRating({ product }: { product: any }) {
  const ratings = product?.tbl_rating ?? [];

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum: number, rating: any) => sum + rating.rating, 0) /
        ratings.length
      : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-start">
        {Array.from({ length: 5 }).map((_, index) => {
          return (
            <div key={index}>
              {averageRating >= index + 1 ? (
                <Star fill="orange" size={14} strokeWidth={0} />
              )  : (
                <Star fill="gray" size={14} strokeWidth={0} />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-slate-500 text-xs sm:text-sm font-medium">
        {averageRating.toFixed(1)}
      </p>
    </div>
  );
}
