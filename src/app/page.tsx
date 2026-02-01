
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

export default async function Home() {

  const [productsCategory, topProducts, ordersByStatus, recentOrders, metrics] = await Promise.all([
    getProductsByCategory(),
    getTopProducts(),
    getOrdersByStatus(),
    getRecentOrders(),
    getDashboardMetrics()
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
                    <p className="text-sm font-medium text-foreground">Last Synced: {`1 hour ago`}</p>
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
          daily={[{
            name: "January 1st",
            value: 100,
            date: "2023-01-01",
          }, {
            name: "January 2nd",
            value: 200,
            date: "2023-01-02",
          }, {
            name: "January 3rd",
            value: 300,
            date: "2023-01-03",
          }, {
            name: "January 18th",
            value: 1800,
            date: "2023-01-18",
          }, {
            name: "January 19th",
            value: 1900,
            date: "2023-01-19",
          }, {
            name: "January 20th",
            value: 2000,
            date: "2023-01-20",
          }, {
            name: "January 21st",
            value: 2100,
            date: "2023-01-21",
          }, {
            name: "January 22nd",
            value: 2200,
            date: "2023-01-22",
          }, {
            name: "January 23rd",
            value: 2300,
            date: "2023-01-23",
          }, {
            name: "January 29th",
            value: 2900,
            date: "2023-01-29",
          }, {
            name: "January 30th",
            value: 3000,
            date: "2023-01-30",
          }, {
            name: "January 31st",
            value: 3100,
            date: "2023-01-31",
          }]}
          monthly={[{
            name: "January",
            value: 100,
          }, {
            name: "February",
            value: 200,
          }, {
            name: "March",
            value: 300,
          }, {
            name: "April",
            value: 400,
          }, {
            name: "May",
            value: 500,
          }, {
            name: "June",
            value: 600,
          }, {
            name: "July",
            value: 700,
          }, {
            name: "August",
            value: 800,
          }, {
            name: "September",
            value: 900,
          }, {
            name: "October",
            value: 1000,
          }, {
            name: "November",
            value: 1100,
          }, {
            name: "December",
            value: 1200,
          }]}
          yearly={[{
            name: "2022",
            value: 100,
          }, {
            name: "2023",
            value: 200,
          }, {
            name: "2024",
            value: 300,
          }, {
            name: "2025",
            value: 400,
          }, {
            name: "2026",
            value: 500,
          }, {
            name: "2027",
            value: 600,
          }, {
            name: "2028",
            value: 700,
          }, {
            name: "2029",
            value: 800,
          }, {
            name: "2030",
            value: 900,
          }, {
            name: "2031",
            value: 1000,
          }, {
            name: "2032",
            value: 1100,
          }, {
            name: "2033",
            value: 1200,
          }]}
          hourly={[{
            name: "12am",
            value: 100,
            date: "2023-01-01",
          }, {
            name: "2pm",
            value: 1500,
            date: "2023-01-01",
          }, {
            name: "3pm",
            value: 1600,
            date: "2023-01-01",
          }, {
            name: "4pm",
            value: 1700,
            date: "2023-01-01",
          }, {
            name: "5pm",
            value: 1800,
            date: "2023-01-01",
          }, {
            name: "6pm",
            value: 700,
            date: "2023-01-01",
          }, {
            name: "7pm",
            value: 2000,
            date: "2023-01-01",
          }, {
            name: "8pm",
            value: 2100,
            date: "2023-01-01",
          }, {
            name: "9pm",
            value: 1800,
            date: "2023-01-01",
          }, {
            name: "10pm",
            value: 2300,
            date: "2023-01-01",
          }, {
            name: "11pm",
            value: 2400,
            date: "2023-01-01",
          }]} 
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <RecentOrders orders={recentOrders} />

        <TopProducts products={topProducts} />
      </div>
    </div>
  )
}
         