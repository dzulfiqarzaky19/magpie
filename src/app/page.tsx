
import { Insights } from "@/components/dashboard/Insights/Insights";
import { Metric } from "@/components/dashboard/Metric";
import { OrderStatus } from "@/components/dashboard/OrderStatus";
import { ProductCategory } from "@/components/dashboard/ProductCategory";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { getDashboardMetrics } from "@/services/metrics";
import { getProductsByCategory, getTopProducts } from "@/services/product";
import { getOrdersByStatus, getRecentOrders } from "@/services/order";
import { DollarSign, ShoppingCart, Star } from "lucide-react";
import { getLastSyncedTime, getSalesHistory } from "@/services/insights";
import { formatDistanceToNow } from "date-fns";

export default async function Home() {

  const [
    productsCategory,
    topProducts,
    ordersByStatus,
    recentOrders,
    metrics,
    salesHistory,
    lastSyncedTime
  ] = await Promise.all([
    getProductsByCategory(),
    getTopProducts(),
    getOrdersByStatus(),
    getRecentOrders(),
    getDashboardMetrics(),
    getSalesHistory(),
    getLastSyncedTime()
  ])

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
                    <p className="text-sm font-medium text-foreground">Last Synced: {formatDistanceToNow(lastSyncedTime, { addSuffix: true })}</p>
                </div>
            </div>
     
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Metric 
          title="Total Revenue"
          value={`$${metrics.revenue.value.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: metrics.revenue.trend, isPositive: metrics.revenue.trend >= 0 }}
          color="blue"
        />
        <Metric 
          title="Total Orders"
          value={metrics.orders.value.toLocaleString()}
          icon={ShoppingCart}
          trend={{ value: metrics.orders.trend, isPositive: metrics.orders.trend >= 0 }}
          color="purple"
        />
        <Metric 
          title="Average Order Value"
          value={`$${metrics.averageOrder.value.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: metrics.averageOrder.trend, isPositive: metrics.averageOrder.trend >= 0 }}
          color="orange"
        />
        <Metric 
          title="Average Product Rating"
          value={metrics.rating.value.toFixed(1)}
          icon={Star}
          trend={{ value: metrics.rating.trend, isPositive: metrics.rating.trend >= 0 }}
          color="emerald"
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <OrderStatus data={ordersByStatus} />

        <ProductCategory data={productsCategory} />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Insights 
          daily={salesHistory.daily}
          monthly={salesHistory.monthly}
          yearly={salesHistory.yearly}
          hourly={salesHistory.hourly}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders orders={recentOrders} />

        <TopProducts products={topProducts} />
      </div>
    </div>
  )
}
         