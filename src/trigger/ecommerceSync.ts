import { schedules } from "@trigger.dev/sdk/v3";
import { Product, Order } from "@prisma/client";

export const ecommerceSync = schedules.task({
  id: "ecommerce-sync",
  cron: "0 * * * *",
  run: async () => {
    const productsRes = await fetch("https://fake-store-api.mock.beeceptor.com/api/products");
    const products: Product[] = await productsRes.json();

    const ordersRes = await fetch("https://fake-store-api.mock.beeceptor.com/api/orders");
    const orders: Order[] = await ordersRes.json();

    return {
      success: true,
      productsLength: products.length,
      ordersLength: orders.length,
      message: "Sync completed successfully, data fetched",
    }
  },
});