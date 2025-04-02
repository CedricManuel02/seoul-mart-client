"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
} satisfies ChartConfig

export default function DashboardBarcharts({chartData} : {chartData: any}) {
    return (
        <ChartContainer config={chartConfig} className="flex justify-center items-center">
            <BarChart accessibilityLayer data={chartData} className="w-full mx-auto">
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="sales" fill="var(--color-desktop)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
