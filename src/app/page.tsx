
// 2 Data Tables

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

        <ProductCategory data={[
          { name: "Electronics", value: 300 },
          { name: "Clothing", value: 200 },
          { name: "Books", value: 100 },
          { name: "Home & Kitchen", value: 50 },
          { name: "Beauty & Personal Care", value: 25 },
        ]} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Insights />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders orders={[{
          id: 1,
          externalId: 1,
          userId: 1,
          status: "Delivered",
          totalPrice: 100,
          createdAt: new Date(),
          syncedAt: new Date(),
        }, {
          id: 2,
          externalId: 2,
          userId: 2,
          status: "Shipped",
          totalPrice: 200,
          createdAt: new Date(),
          syncedAt: new Date(),
        }, {
          id: 3,
          externalId: 3,
          userId: 3,
          status: "Processing",
          totalPrice: 300,
          createdAt: new Date(),
          syncedAt: new Date(),
        }, {
          id: 4,
          externalId: 4,
          userId: 4,
          status: "Cancelled",
          totalPrice: 400,
          createdAt: new Date(),
          syncedAt: new Date(),
        }, {
          id: 5,
          externalId: 5,
          userId: 5,
          status: "Pending",
          totalPrice: 500,
          createdAt: new Date(),
          syncedAt: new Date(),
        }]} />
        <TopProducts />
      </div>
    </div>
  );
}
