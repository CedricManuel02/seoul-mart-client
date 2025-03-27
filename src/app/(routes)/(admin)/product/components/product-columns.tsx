"use client"

import { ColumnDef } from "@tanstack/react-table"
import ProductBarcode from "./product-barcode"
import Image from "next/image"
import { formatCurrency } from "@/_utils/helper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { deleteProductServerAction, retrieveProductServerAction } from "@/_action/(admin)/product"
import { toast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { IProduct, IVariant, IVariants } from "@/_interface/interface"
import Link from "next/link"
import ProductVariants from "./product-variants"


const handleDeleteProduct = async (product_id: string) => {
  try {
    const response = await deleteProductServerAction(product_id);
    if (response.error) {
      console.error("Error while deleting product:", response.error);
      toast({
        title: "Failed to delete",
        variant: "destructive",
        description: "Failed to delete product, please try again",
      })
      return;
    }
    toast({
      title: "Product deleted successfully",
      variant: "default",
      description: "Product has been deleted successfully",
    })
  } catch (error) {
    console.error("Something went wrong while deleting product:", error);
  }
}
const handleRetrieveProduct = async (product_id: string) => {
  try {
    const response = await retrieveProductServerAction(product_id);
    if (response.error) {
      console.error("Error while retrieve product:", response.error);
      toast({
        title: "Failed to retrieve",
        variant: "destructive",
        description: "Failed to retrieve product, please try again",
      })
      return;
    }
    toast({
      title: "Product retrieve successfully",
      variant: "default",
      description: "Product has been retrieve successfully",
    })
  } catch (error) {
    console.error("Something went wrong while deleting product:", error);
  }
}
export const columns: ColumnDef<IProduct>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={() => {
          console.log("Row clicked", row.original.product_id);
        }}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "product_upc_number",
    header: () => <div className="text-left">Barcode</div>,
    cell: ({ row }) => {
      return <div><ProductBarcode barcode={row.getValue("product_upc_number")} /></div>
    },
  },
  {
    accessorKey: "tbl_variants",
    header: () => <div className="text-left">Image</div>,
    cell: ({ row }) => {
      const variants = row.getValue("tbl_variants") as { variant_image_url: string }[];
      const imageUrl = variants?.[0]?.variant_image_url;
      return (
        <div className="flex items-center space-x-2">
          {imageUrl ? (
            <Image loading="lazy" className="rounded-md" alt={"product"} src={imageUrl} height={50} width={50} />
          ) : (
            <span>No Image</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "product_name",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name <ArrowUpDown size={15} /></div>,
  },
  {
    id: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("tbl_variants") as IVariants[];
      return (
        <ProductVariants variant={variants}/>
      );
    },
  },
  {
    accessorKey: "variant_price",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Price <ArrowUpDown size={15} /></div>,
    cell: ({ row }) => {
      const variants = row.getValue("tbl_variants") as { variant_price: string }[];
      const price = variants?.[0]?.variant_price;

      const formattedPrice = price ? formatCurrency(Number(price)) : "N/A";

      return <div>{formattedPrice}</div>;
    },
    sortingFn: (a, b)  => { 
      const priceA = a.original.tbl_variants?.[0]?.variant_price;
      const priceB = b.original.tbl_variants?.[0]?.variant_price;

      return Number(priceA) - Number(priceB);
    }
  },
  {
    accessorKey: "tbl_categories",
    header:"Category",
    cell: ({ row }) => {
      const categories = row.getValue("tbl_categories") as { category_name: string };
      return (
        <div>
          <span key={categories.category_name}>{categories.category_name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "product_date_deleted",
    header: ({ column }) => <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status <ArrowUpDown size={15} /></div>,
    cell: ({ row }) => {
      const isDeleted = row.getValue("product_date_deleted");
      return (
        <div>
          {isDeleted ? (
            <span className="text-red-500">Deleted</span>
          ) : (
            <span className="text-green-500">Active</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const product_id = row.original.product_id;
      const isDeleted = row.original.product_date_deleted;
      return (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(product_id);
                  toast({
                    title: "SKU copied",
                    variant: "default",
                    description: "SKU has been copied to clipboard",
                  });
                }}
              >
                Copy SKU
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/product/update/${product_id}`}> <DropdownMenuItem>Edit</DropdownMenuItem></Link>
              {isDeleted ? (<DropdownMenuItem onClick={() => handleRetrieveProduct(product_id)}>Retrieve</DropdownMenuItem>) : (<DropdownMenuItem onClick={() => handleDeleteProduct(product_id)}>Delete</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
];
