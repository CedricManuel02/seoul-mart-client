import { getDashboardBarchartServerAction } from "@/_action/(admin)/dashboard";
import React from "react";
import DashboardBarcharts from "./dashboard-barchart";

export default async function DashboardBarchartContainer() {
  const response = await getDashboardBarchartServerAction();
  return (
    <div>
      <DashboardBarcharts chartData={response} />
    </div>
  );
}
