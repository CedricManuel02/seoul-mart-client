"use client"
import { IProduct } from "@/_interface/interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ProductVariants from "./product-variants";
import Image from "next/image";
import DeleteProductModal from "./delete-product-modal";
import RetrieveProductModal from "./retrieve-product-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ProductBarcode from "./product-barcode";
export default function ProductTable({ products }: { products: IProduct[] }) {
  const router = useRouter();
  return (
      <Table className="whitespace-nowrap">
        {/* Table Header */}
        <TableHeader>
          <TableRow>
            <TableHead>Barcode</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        {/* Table Body */}
        <TableBody>
          {products
            .map((products) => (
              <TableRow key={products.product_id} className="text-slate-500 font-medium">
                <TableCell><ProductBarcode barcode={products.product_upc_number}/></TableCell>
                <TableCell>
                    <div className="flex items-center gap-4 w-80">
                    <Image className="w-10 h-10 object-contain" src={products.tbl_variants[0].variant_image_url} alt={products.tbl_variants[0].variant_name} width={20} height={20} priority={true}/>
                    {products.product_name}
                    </div>
                </TableCell>
                <TableCell><ProductVariants variant={products.tbl_variants}/></TableCell>
                <TableCell>{products.tbl_categories.category_name}</TableCell>
                <TableCell>{products.product_date_deleted ? (<Badge variant={"destructive"}>Not Available</Badge>) : (<Badge variant={"outline"}>Available</Badge>)}</TableCell>
                <TableCell><p>{new Date(products.product_date_created).toLocaleDateString("en-US", {month: "long", day: "2-digit", year: "numeric"})}</p></TableCell>
                <TableCell>
                   <div className="flex items-center space-x-2 justify-end">
                   <Button variant={"outline"}>Discount</Button>
                   <Button variant={"outline"} onClick={() => router.push(`/product/update/${products.product_id}`)}>Edit</Button>
                    {products.product_date_deleted === null ? (
                        <DeleteProductModal product_id={products.product_id}/>
                    ) : (
                        <RetrieveProductModal product_id={products.product_id}/>
                    )}
                   </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
  );
}
