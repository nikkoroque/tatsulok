"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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

interface LocationStatsProps {
  title: string;
}

const chartData = [
  { browser: "BULK", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "VNA", visitors: 200, fill: "var(--color-safari)" },
  { browser: "RACK", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "SHELF", visitors: 173, fill: "var(--color-edge)" },
  { browser: "STG", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Locations",
  },
  chrome: {
    label: "BULK",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "VNA",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "RACK",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "SHELF",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "STG",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function LocationStats({ title }: LocationStatsProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}