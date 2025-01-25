"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-04-01", regular: 222, agency: 150 },
  { date: "2024-04-02", regular: 97, agency: 180 },
  { date: "2024-04-03", regular: 167, agency: 120 },
  { date: "2024-04-04", regular: 242, agency: 260 },
  { date: "2024-04-05", regular: 373, agency: 290 },
  { date: "2024-04-06", regular: 301, agency: 340 },
  { date: "2024-04-07", regular: 245, agency: 180 },
  { date: "2024-04-08", regular: 409, agency: 320 },
  { date: "2024-04-09", regular: 59, agency: 110 },
  { date: "2024-04-10", regular: 261, agency: 190 },
  { date: "2024-04-11", regular: 327, agency: 350 },
  { date: "2024-04-12", regular: 292, agency: 210 },
  { date: "2024-04-13", regular: 342, agency: 380 },
  { date: "2024-04-14", regular: 137, agency: 220 },
  { date: "2024-04-15", regular: 120, agency: 170 },
  { date: "2024-04-16", regular: 138, agency: 190 },
  { date: "2024-04-17", regular: 446, agency: 360 },
  { date: "2024-04-18", regular: 364, agency: 410 },
  { date: "2024-04-19", regular: 243, agency: 180 },
  { date: "2024-04-20", regular: 89, agency: 150 },
  { date: "2024-04-21", regular: 137, agency: 200 },
  { date: "2024-04-22", regular: 224, agency: 170 },
  { date: "2024-04-23", regular: 138, agency: 230 },
  { date: "2024-04-24", regular: 387, agency: 290 },
  { date: "2024-04-25", regular: 215, agency: 250 },
  { date: "2024-04-26", regular: 75, agency: 130 },
  { date: "2024-04-27", regular: 383, agency: 420 },
  { date: "2024-04-28", regular: 122, agency: 180 },
  { date: "2024-04-29", regular: 315, agency: 240 },
  { date: "2024-04-30", regular: 454, agency: 380 },
  { date: "2024-05-01", regular: 165, agency: 220 },
  { date: "2024-05-02", regular: 293, agency: 310 },
  { date: "2024-05-03", regular: 247, agency: 190 },
  { date: "2024-05-04", regular: 385, agency: 420 },
  { date: "2024-05-05", regular: 481, agency: 390 },
  { date: "2024-05-06", regular: 498, agency: 520 },
  { date: "2024-05-07", regular: 388, agency: 300 },
  { date: "2024-05-08", regular: 149, agency: 210 },
  { date: "2024-05-09", regular: 227, agency: 180 },
  { date: "2024-05-10", regular: 293, agency: 330 },
  { date: "2024-05-11", regular: 335, agency: 270 },
  { date: "2024-05-12", regular: 197, agency: 240 },
  { date: "2024-05-13", regular: 197, agency: 160 },
  { date: "2024-05-14", regular: 448, agency: 490 },
  { date: "2024-05-15", regular: 473, agency: 380 },
  { date: "2024-05-16", regular: 338, agency: 400 },
  { date: "2024-05-17", regular: 499, agency: 420 },
  { date: "2024-05-18", regular: 315, agency: 350 },
  { date: "2024-05-19", regular: 235, agency: 180 },
  { date: "2024-05-20", regular: 177, agency: 230 },
  { date: "2024-05-21", regular: 82, agency: 140 },
  { date: "2024-05-22", regular: 81, agency: 120 },
  { date: "2024-05-23", regular: 252, agency: 290 },
  { date: "2024-05-24", regular: 294, agency: 220 },
  { date: "2024-05-25", regular: 201, agency: 250 },
  { date: "2024-05-26", regular: 213, agency: 170 },
  { date: "2024-05-27", regular: 420, agency: 460 },
  { date: "2024-05-28", regular: 233, agency: 190 },
  { date: "2024-05-29", regular: 78, agency: 130 },
  { date: "2024-05-30", regular: 340, agency: 280 },
  { date: "2024-05-31", regular: 178, agency: 230 },
  { date: "2024-06-01", regular: 178, agency: 200 },
  { date: "2024-06-02", regular: 470, agency: 410 },
  { date: "2024-06-03", regular: 103, agency: 160 },
  { date: "2024-06-04", regular: 439, agency: 380 },
  { date: "2024-06-05", regular: 88, agency: 140 },
  { date: "2024-06-06", regular: 294, agency: 250 },
  { date: "2024-06-07", regular: 323, agency: 370 },
  { date: "2024-06-08", regular: 385, agency: 320 },
  { date: "2024-06-09", regular: 438, agency: 480 },
  { date: "2024-06-10", regular: 155, agency: 200 },
  { date: "2024-06-11", regular: 92, agency: 150 },
  { date: "2024-06-12", regular: 492, agency: 420 },
  { date: "2024-06-13", regular: 81, agency: 130 },
  { date: "2024-06-14", regular: 426, agency: 380 },
  { date: "2024-06-15", regular: 307, agency: 350 },
  { date: "2024-06-16", regular: 371, agency: 310 },
  { date: "2024-06-17", regular: 475, agency: 520 },
  { date: "2024-06-18", regular: 107, agency: 170 },
  { date: "2024-06-19", regular: 341, agency: 290 },
  { date: "2024-06-20", regular: 408, agency: 450 },
  { date: "2024-06-21", regular: 169, agency: 210 },
  { date: "2024-06-22", regular: 317, agency: 270 },
  { date: "2024-06-23", regular: 480, agency: 530 },
  { date: "2024-06-24", regular: 132, agency: 180 },
  { date: "2024-06-25", regular: 141, agency: 190 },
  { date: "2024-06-26", regular: 434, agency: 380 },
  { date: "2024-06-27", regular: 448, agency: 490 },
  { date: "2024-06-28", regular: 149, agency: 200 },
  { date: "2024-06-29", regular: 103, agency: 160 },
  { date: "2024-06-30", regular: 446, agency: 400 },
];

const chartConfig = {
  employees: {
    label: "Employees",
  },
  regular: {
    label: "Regular",
    color: "hsl(var(--chart-1))",
  },
  agency: {
    label: "Agency",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function LaborHistory() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b sm:flex-row ">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Labor History</CardTitle>
          <CardDescription>
            Showing total labor hours for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-regular)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-regular)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-agency)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-agency)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="agency"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="regular"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}