"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { insightsChartConfig } from "@/const/chartConfig"
import { InsightsHeader } from "./InsightsHeader"
import { useMemo, useState } from "react"

export type TPeriod = 'daily' | 'monthly' | 'yearly';

interface InsightsProps {
  daily: { name: string; value: number; date: string }[];
  monthly: { name: string; value: number }[];
  yearly: { name: string; value: number }[];
  hourly: { name: string; value: number; date: string }[];
}

export const Insights = ({ daily, monthly, yearly, hourly }: InsightsProps) => {
  const [period, setPeriod] = useState<TPeriod>('daily');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const activeData = useMemo(() => {
    if (selectedDate && period === 'daily') {
        return hourly.filter(h => h.date === selectedDate);
    }

    switch (period) {
        case 'daily': return daily;
        case 'monthly': return monthly;
        case 'yearly': return yearly;
        default: return daily;
    }
  }, [period, selectedDate, daily, monthly, yearly, hourly]);

  return (
    <Card className="col-span-full shadow-sm border-border/50 transition-all">
      <InsightsHeader 
        selectedDate={selectedDate}
        period={period}
        setSelectedDate={setSelectedDate}
        setPeriod={setPeriod}
      />

      <CardContent>
        <ChartContainer config={insightsChartConfig} className="h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={activeData}
            margin={{
              left: 12,
              right: 12,
            }}
            onClick={(e) => {
                if (period === 'daily' && !selectedDate && e && e.activePayload && e.activePayload[0]) {
                    const payload = e.activePayload[0].payload;
                    if (payload && payload.date) {
                        setSelectedDate(payload.date);
                    }
                }
            }}
            className={period === 'daily' && !selectedDate ? "cursor-pointer" : ""}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.5} />
            
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={period === 'yearly' ? 0 : 32}
            />
            
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillValue)"
              fillOpacity={1}
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={true}
              animationDuration={500}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
