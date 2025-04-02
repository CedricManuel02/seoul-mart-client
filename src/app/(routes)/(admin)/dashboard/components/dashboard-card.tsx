import { formatCurrency } from "@/_utils/helper";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import React from "react";

export default function DashboardCard({ background, count, percentage, title, different }: any) {
  return (
    <Card className={`${background ? "bg-blue-50" : "bg-green-50"} rounded-md h-auto p-4 relative shadow-sm`}>
      <h2 className="text-slate-700 text-2xl font-semibold pb-2">{title === "Revenue" ? formatCurrency(count) : count}</h2>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-slate-500 text-xs font-medium">Total {title}</h4>
          <p className="text-slate-700 text-sm py-2">{percentage}%</p>
          <p className="text-slate-400 text-xs">This month</p>
        </div>
        {different ? <TrendingUp className="text-green-500" size={23} /> : <TrendingDown className="text-red-500" size={23} />}
      </div>
    </Card>
  );
}
