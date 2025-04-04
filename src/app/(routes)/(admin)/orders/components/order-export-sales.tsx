"use client";
import * as React from "react";
import { Download, Files, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ButtonLoading from "@/_components/shared/button-loading/button-loading";
import { generateSalesReport } from "@/_action/(admin)/dashboard";
import { toast } from "@/hooks/use-toast";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { IOrders } from "@/_interface/interface";
import { SalesDocument } from "@/_components/shared/sales-pdf/sales";

const formExportSalesSchema = z.object({
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().min(1, { message: "End date is required" }),
});

export function OrderExportSales({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [loading, setLoading] = React.useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [order, setOrder] = React.useState<IOrders[]>([]);
  const currentDate = new Date();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: addDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 20),
  });

  const form = useForm<z.infer<typeof formExportSalesSchema>>({
    resolver: zodResolver(formExportSalesSchema),
    defaultValues: {
      start_date: date?.from ? format(date.from, "yyyy-MM-dd") : "",
      end_date: date?.to ? format(date.to, "yyyy-MM-dd") : "",
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formExportSalesSchema>) => {
    try {
      data = {
        start_date: date?.from ? format(date.from, "yyyy-MM-dd") : "",
        end_date: date?.to ? format(date.to, "yyyy-MM-dd") : "",
      }
      setLoading(true);
      const response = await generateSalesReport(data);
      if (response.error) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
          description: response.error,
        });
        return;
      }
      setOrder(response);
    } catch (error) {
      console.error("Somethin went wrong while exporting sales report:", error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Files />
          Export Sales
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Sales Report</DialogTitle>
          <DialogDescription>Choose a date range for your sales report.</DialogDescription>
        </DialogHeader>
        {order.length === 0 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className={cn("grid gap-2", className)}>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={false}>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar initialFocus mode="range" selected={date} onSelect={setDate} numberOfMonths={2} />
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <Button variant={"destructive"} type="submit" disabled={loading}>
                  {loading ? <ButtonLoading text="Generating..." /> : "Generate Report"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
        {order.length > 0 && (
          <div className="flex items-end justify-between w-full gap-4 flex-col">
            <PDFViewer className="w-full h-[550px] hidden lg:block">
              <SalesDocument order={order} start_date={form.getValues("start_date")} end_date={form.getValues("end_date")} />
            </PDFViewer>
            <div className="flex items-center justify-end w-full gap-4 flex-col lg:flex-row">
              <Button onClick={() => setOrder([])} className="w-full md:w-auto" variant={"outline"}>
                <RotateCcw />
                Generate Again
              </Button>
              <PDFDownloadLink
                document={<SalesDocument order={order} start_date={form.getValues("start_date")} end_date={form.getValues("end_date")} />}
                fileName={`sales-report-${form.getValues("start_date")}-${form.getValues("end_date")}.pdf`}
              >
                <Button className="w-full md:w-auto" variant={"destructive"}>
                  <Download />
                  Download
                </Button>
              </PDFDownloadLink>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
