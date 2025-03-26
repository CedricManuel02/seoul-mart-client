"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "January", sales: 186 },
    { month: "February", sales: 305 },
    { month: "March", sales: 237 },
    { month: "April", sales: 73 },
    { month: "May", sales: 209 },
    { month: "June", sales: 214 },
    { month: "July", sales: 0 },
    { month: "August", sales: 14 },
    { month: "September", sales: 564 },
    { month: "October", sales: 254 },
    { month: "November", sales: 114 },
    { month: "December", sales: 284 },
]

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

export default function DashboardBarcharts() {
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
