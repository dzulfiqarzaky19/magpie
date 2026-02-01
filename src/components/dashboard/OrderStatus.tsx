"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"
import { MoreHorizontal } from "lucide-react"
import { orderChartConfig } from "@/const/chartConfig"

interface OrderStatusProps {
  data: { name: string; value: number }[];
}

export function OrderStatus({ data }: OrderStatusProps) {
  const total = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0)
  }, [data])

  const chartData = React.useMemo(() => {
    return data.map(item => {
        const key = item.name as keyof typeof orderChartConfig;
        const configItem = orderChartConfig[key];
        const color = configItem && 'color' in configItem ? configItem.color : "#94a3b8"; 
        
        return {
            ...item,
            fill: color
        }
    })
  }, [data])

  return (
    <Card className="col-span-full lg:col-span-3 shadow-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Orders by Status</CardTitle>
        <MoreHorizontal className="h-5 w-5 text-muted-foreground cursor-pointer" />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={orderChartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={75}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs font-medium uppercase tracking-widest"
                        >
                          Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
             <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
