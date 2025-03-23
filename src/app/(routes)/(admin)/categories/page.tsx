import React from "react";
import CategoryList from "./components/category-list";
import CreateCategoryModal from "./components/create-category-modal";

export default function Category() {
  return (
    <div className="bg-slate-50 w-full h-full">
      <div className=" w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-10">
      <div className="py-4">
        <div className="flex justify-between flex-col items-start gap-2 lg:items-center lg:flex-row">
          <div className="space-y-1">
            <h2 className="text-slate-700 font-semibold text-md lg:text-xl">
              Category
            </h2>
            <p className="text-slate-500 text-xs lg:text-sm">
              Manage the shop categories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Category Create Modal */}
            <CreateCategoryModal />
          </div>
        </div>
      </div>
      {/* Category Grid List */}
      <CategoryList />
    </div>
    </div>
  );
}
