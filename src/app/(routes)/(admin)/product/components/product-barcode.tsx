import { useBarcode } from "next-barcode";
import React from "react";

export default function ProductBarcode({barcode} : {barcode: string}) {
  const { inputRef } = useBarcode({
    value: barcode,
    options: {
      background: "transparent",
    },
  });
  return <svg className="w-32 h-16" ref={inputRef} />;
}
