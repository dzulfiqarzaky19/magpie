"use client"

import { Bar, BarChart, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { productChartConfig } from "@/const/chartConfig"

interface ProductCategoryProps {
  data: { name: string; value: number }[];
}


export function ProductCategory({ data }: ProductCategoryProps) {
  return (
    <Card className="col-span-full lg:col-span-4 shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
            <CardTitle>Products by Category</CardTitle>
            <p className="text-sm text-muted-foreground">Inventory distribution across top segments</p>
        </div>
        <Badge variant="outline" className="font-normal text-muted-foreground bg-muted/50 rounded-full px-3">
            This Year
        </Badge>
      </CardHeader>
      <CardContent>
        <ChartContainer config={productChartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--muted)' }} 
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={8} barSize={50} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
