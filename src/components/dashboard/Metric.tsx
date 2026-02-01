import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "purple" | "orange" | "emerald";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  emerald: "bg-emerald-50 text-emerald-600",
};

export const Metric = ({ title, value, icon: Icon, trend, color = "blue" }: MetricProps) => (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn("p-3 rounded-2xl", colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
              trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}>
              <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
