

// 2 Standard Charts
// Orders grouped by Status (Pie/Donut)
// Product count grouped by Category (Bar/Column)
// 2 Data Tables
// Recent Orders (Latest 5 by order_id)
// Top Products (5 highest priced items)
// 1 Custom "Insight" Chart

import { Insights } from "@/components/dashboard/Insights";
import { Metric } from "@/components/dashboard/Metric";
import { OrderStatus } from "@/components/dashboard/OrderStatus";
import { ProductCategory } from "@/components/dashboard/ProductCategory";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { DollarSign, ShoppingCart, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-6">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Real-time performance metrics and business insights.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">System Status</p>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-sm font-medium text-foreground">Last Synced: {`1 hour ago`}</p>
                </div>
            </div>
     
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Metric 
          title="Total Revenue"
          value="$12,345.67"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <Metric 
          title="Total Orders"
          value="1,234"
          icon={ShoppingCart}
          trend={{ value: 12, isPositive: true }}
          color="purple"
        />
        <Metric 
          title="Average Order Value"
          value="$123.45"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
          color="orange"
        />
        <Metric 
          title="Average Product Rating"
          value="4.5"
          icon={Star}
          trend={{ value: 12, isPositive: true }}
          color="emerald"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <OrderStatus data={[
          { name: "Delivered", value: 300 },
          { name: "Shipped", value: 200 },
          { name: "Processing", value: 100 },
          { name: "Cancelled", value: 50 },
          { name: "Pending", value: 25 },
        ]} />
        <ProductCategory/>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Insights />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders />
        <TopProducts />
      </div>
    </div>
  );
}
