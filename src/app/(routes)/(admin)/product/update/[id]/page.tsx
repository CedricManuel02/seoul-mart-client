import React from "react";
import UpdateForm from "../components/update-form";
import { getProductServerAction } from "@/_action/(admin)/variant";

export default async function ProductUpdate({params}: {params: { id: string };}) {
  const { id } = await params;

  const product = await getProductServerAction(id);

  return (
    <div className="w-full bg-slate-50 h-auto flex items-center justify-center">
      <div className="w-11/12 lg:w-10/12">
        <UpdateForm product={product} />
      </div>
    </div>
  );
}
