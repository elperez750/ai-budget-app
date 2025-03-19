"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

import { transactions } from "../data/TransactionData";

const categories = [
  ...new Set(
    transactions
      .filter((transaction) => transaction.category !== "Income")
      .map((transaction) => transaction.category) // Extract categories
  ),
];

console.log(categories);

// Then calculate sums for each category
const sums = categories.map((category) => {
  const categoryTotal = transactions
    .filter((transaction) => transaction.category === category)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return categoryTotal;
});

// Create the final object with two arrays
const categoryData = categories.map((category, index) => {
  const normalizedCategory = category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-"); // Replace "&" with "and" and spaces with "-"

  return {
    category: normalizedCategory,
    sum: sums[index],
    fill: `var(--color-${normalizedCategory})`,
  };
});

const chartConfig = {
  sum: {
    label: "Amount",
  },
  foodDining: {
    label: "Food & Dining",
    color: "var(--color-food-dining)",
  },
  transportation: {
    label: "Transportation",
    color: "hsl(var(--color-transportation)",
  },
  utilities: {
    label: "Utilities",
    color: "hsl(var(--color-utilities))",
  },
  shopping: {
    label: "Shopping",
    color: "hsl(var(--color-shopping))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--color-entertainment))",
  },
  fitness: {
    label: "Fitness",
    color: "hsl(var(--color-fitness))",
  },
  housing: {
    label: "Housing",
    color: "hsl(var(--color-housing))",
  },
  investments: {
    label: "Investments",
    color: "hsl(var(--color-investments))",
  },
  loans: {
    label: "Loans",
    color: "hsl(var(--color-loans))",
  },
  healthcare: {
    label: "Healthcare",
    color: "hsl(var(--color-healthcare))",
  },
  automotive: {
    label: "Automotive",
    color: "hsl(var(--color-automotive))",
  },
  gifts: {
    label: "Gifts",
    color: "hsl(var(--color-gifts))",
  },
  travel: {
    label: "Travel",
    color: "hsl(var(--color-travel))",
  },
} satisfies ChartConfig;

export function PieChartSpending() {
  const totalVisitors = React.useMemo(() => {
    return categoryData.reduce((acc, curr) => acc + curr.sum, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending this month</CardTitle>
        <CardDescription>March 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categoryData}
              dataKey="sum"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Dollars spent
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
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
