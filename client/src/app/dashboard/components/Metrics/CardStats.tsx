"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CardStatsProps {
  title: string;
}

// Function to generate random data for chart
function generateChartData() {
  const months = ["January", "February", "March", "April", "May", "June"];

  let previousTotal = 0;
  let total = 0;

  const data = months.map((month) => {
    const desktop = Math.floor(Math.random() * 1000001);
    const mobile = Math.floor(Math.random() * 1000001);
    const monthlyTotal = desktop + mobile;
    total += monthlyTotal;

    // Calculate percentage change from the previous month
    const percentChange =
      previousTotal === 0
        ? null // No change for the first month
        : ((monthlyTotal - previousTotal) / previousTotal) * 100;

    previousTotal = monthlyTotal;

    return {
      month,
      desktop,
      mobile,
      total: monthlyTotal,
      percentChange, // Store the percentage change
    };
  });

  return { data, totalFormatted: total.toLocaleString() };
}

// Generate the data
const { data: chartData, totalFormatted: totalFormattedNumber } =
  generateChartData();

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CardStats({ title }: CardStatsProps) {
  // Get the percentage change for the latest month
  const latestChange = chartData[chartData.length - 1].percentChange;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalFormattedNumber}</div>
        <p
          className={`text-xs ${
            latestChange !== null && latestChange > 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {latestChange !== null
            ? `${latestChange > 0 ? "+" : ""}${latestChange.toFixed(1)}% ${
                latestChange > 0 ? "from last month" : "drop from last month"
              }`
            : "No data for previous month"}
        </p>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()} // Explicitly type 'value'
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {latestChange !== null && latestChange > 0 ? (
            <>
              Trending up by {latestChange.toFixed(1)}%{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : latestChange !== null ? (
            <>
              Dropping by {Math.abs(latestChange).toFixed(1)}%{" "}
              <TrendingDown className="h-4 w-4 text-red-500" />
            </>
          ) : (
            "No data available"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total items sold for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}