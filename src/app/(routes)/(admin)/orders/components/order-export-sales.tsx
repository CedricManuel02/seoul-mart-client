import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Files } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";


export function OrderExportSales() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Files />
          Export Sales
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sales Report</DialogTitle>
          <DialogDescription>
            Choose a date range for your sales report.
          </DialogDescription>
        </DialogHeader>
        <Input type="date"/>

        <DialogFooter>
          <Button type="submit">Generate Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
