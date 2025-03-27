"use client"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { MoreHorizontal } from "lucide-react";
import { deleteProductServerAction, retrieveProductServerAction } from "@/_action/(admin)/product";
import { IProduct } from "@/_interface/interface";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function ProductTable({ columns, data }: DataTableProps<IProduct, any>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const handleDeleteProduct = async () => {
    try {
      const selectedRowIds = Object.keys(rowSelection); // Get selected row IDs
  
      if (selectedRowIds.length === 0) {
        toast({
          title: "No rows selected",
          variant: "destructive",
          description: "Please select a row to delete",
        });
        return;
      }
  
      for (const rowId of selectedRowIds) {
        const product = table.getRow(rowId)
        const product_id = product.original.product_id ;
        const response = await deleteProductServerAction(product_id);
  
        if (response.error) {
          console.error("Error while deleting product:", response.error);
          toast({
            title: "Failed to delete",
            variant: "destructive",
            description: `Failed to delete product with ID ${rowId}, please try again`,
          });
          return;
        }
      }
  
      toast({
        title: "Product(s) deleted successfully",
        variant: "default",
        description: `Successfully deleted ${selectedRowIds.length} product(s)`,
      });
  
    } catch (error) {
      console.error("Something went wrong while deleting product:", error);
    }
  };
  const handleRetrieveProduct = async () => {
    try {
      const selectedRowIds = Object.keys(rowSelection); // Get selected row IDs
  
      if (selectedRowIds.length === 0) {
        toast({
          title: "No rows selected",
          variant: "destructive",
          description: "Please select a row to retrieve",
        });
        return;
      }
  
      for (const rowId of selectedRowIds) {
        const product = table.getRow(rowId)
        const product_id = product.original.product_id ;
        const response = await retrieveProductServerAction(product_id);
  
        if (response.error) {
          console.error("Error while retrieve product:", response.error);
          toast({
            title: "Failed to retrieve",
            variant: "destructive",
            description: `Failed to retrieve product, please try again`,
          });
          return;
        }
      }
  
      toast({
        title: "Product(s) retrieve successfully",
        variant: "default",
        description: `Successfully retrieve ${selectedRowIds.length} product(s)`,
      });
  
    } catch (error) {
      console.error("Something went wrong while retrieving product:", error);
    }
  };
 
  return (

    <div className="w-11/12 xl:w-9/12 min-h-screen h-auto m-auto py-5 flex flex-col gap-2">
      <header className="bg-white p-4 rounded-md shadow flex flex-col items-start md:flex-row justify-between md:items-center">
        <h2 className="text-slate-700 font-semibold text-md lg:text-xl">
          Product
        </h2>
        <div className="flex items-center gap-2">
          <Input type="text" placeholder="Search Product Name..."
            value={(table.getColumn("product_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("product_name")?.setFilterValue(event.target.value)
            } className="w-full lg:min-w-[250px]" />
          <Link href={"/product/create"}>
            <Button variant={"default"} className="bg-green-500 hover:bg-green-600">Create</Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleDeleteProduct}>Delete</DropdownMenuItem>
              <DropdownMenuItem onClick={handleRetrieveProduct}>Retrieve</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="rounded-md border bg-white p-4 whitespace-nowrap">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
     <div className="py-4 flex flex-col md:flex-row justify-between items-center">
     <div className="text-sm flex text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
     </div>
    </div>
  )
}
