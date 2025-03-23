"use server";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getCategoriesServerAction } from "@/_action/(admin)/categories";
import { ICategory } from "@/_interface/interface";
import CategoryAction from "./category-action";
import DeleteCategoryModal from "./delete-category-modal";
import EditCategoryModal from "./edit-category-modal";
import RetrieveCategoryModal from "./retrieve-category-modal";

export default async function CategoryList() {
  const categories = await getCategoriesServerAction();
  return (
    <div>
      {categories.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((data: ICategory) => (
            <Card key={data.category_id} className="h-auto cursor-pointer shadow-xs border-slate-300">
              <CardContent className="text-sm flex flex-col space-y-2 items-center justify-end p-4">
                <Image
                  className="object-contain h-32 w-32"
                  src={data.category_image_url}
                  alt={data.category_name}
                  width={100}
                  height={100}
                  loading="lazy"
                />
                <h3 className="py-4 font-medium text-md whitespace-nowrap">{data.category_name}</h3>
                {/* Category Section with Client Component Action Button */}
                <CategoryAction>
                  <EditCategoryModal category={data} />
                  {data.category_date_deleted ? (
                    <RetrieveCategoryModal category_id={data.category_id} />
                  ) : (
                    <DeleteCategoryModal category_id={data.category_id} />
                  )}
                </CategoryAction>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-slate-500 text-sm w-full flex items-center justify-center">
            No Categories Listed
        </div>
      )}
    </div>
  );
}
