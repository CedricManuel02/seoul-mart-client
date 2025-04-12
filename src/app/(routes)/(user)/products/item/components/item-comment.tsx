import { formatDate } from "@/_utils/helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";
import ItemCommentImageModal from "./item-comment-image-modal";
import ItemCommentStarRating from "./item-comment-star-rating";

export default function ItemComment({ product }: { product: any }) {
  return (
    <div>
      {product.tbl_rating.length > 0 && (
        <div>
          <h1 className="text-slate-700 font-semibold text-md lg:text-xl">
            Review ({product.tbl_rating.filter((rating: any) => rating.rating_date_deleted === null).length})
          </h1>
          <div className="flex flex-col gap-4 py-4">
            {product.tbl_rating.map((rating: any) => (
             !rating.rating_date_deleted && (
              <div key={rating.rating_id} className="p-2">
              <div className="flex items-start gap-2">
                <Avatar className="w-8 h-8 cursor-pointer hover:opacity-90">
                  <AvatarImage
                    src={`${
                      rating.tbl_users.user_profile
                        ? rating.tbl_users.user_profile
                        : `https://api.dicebear.com/9.x/initials/svg?seed=${rating.tbl_users.user_name}`
                    }`}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-slate-700 text-sm font-medium">
                    {rating.tbl_users.user_name}
                  </h3>
                  <p className="text-slate-500 text-xs font-medium">
                    {formatDate(rating.rating_date_created)}
                  </p>
                  <div className="flex items-center gap-2">
                    <ItemCommentStarRating rating={rating.rating} />
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={"secondary"}
                        className="text-xs font-medium"
                      >
                        {rating.tbl_variants.variant_name}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 py-2 w-full lg:w-7/12">
                    {rating.rating_text}
                  </p>
                  {rating.tbl_rating_media.length > 0 &&
                    rating.tbl_rating_media.map((media: any) => (
                      <ItemCommentImageModal
                        key={media.media_id}
                        media={media.media_path}
                      />
                    ))}
                </div>
              </div>
            </div>
             )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
