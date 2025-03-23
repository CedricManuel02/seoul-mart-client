"use client"
import React, { useEffect } from "react";
import CreateForm from "./components/create-form";
import { useDispatch } from "react-redux";
import { clearVariants } from "@/_redux/features/variant-slice";

export default function ProductUpdate() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearVariants());
  }, [])
  return (
    <div className="w-full bg-slate-50 h-auto min-h-screen flex items-center justify-center py-14">
      <div className="w-11/12 lg:w-10/12">
        <CreateForm />
      </div>
    </div>
  );
}
