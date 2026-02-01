import { schedules } from "@trigger.dev/sdk/v3";
import { syncOrders } from "@/services/order";
import { Order, Product } from "@/lib/types";
import { syncProduct } from "@/services/product";
import { generateNewOrders, generateNewReviews } from "@/lib/utils/dummyGenerator";

export const ecommerceSync = schedules.task({
  id: "ecommerce-sync",
  cron: "0 * * * *",
  run: async () => {
    const productsRes = await fetch("https://fake-store-api.mock.beeceptor.com/api/products");
    const products: Product[] = await productsRes.json();

    await syncProduct(products);

    const ordersRes = await fetch("https://fake-store-api.mock.beeceptor.com/api/orders");
    const orders: Order[] = await ordersRes.json();

    await syncOrders(orders);

    const syntheticCount = 2;

    await Promise.all(
      Array.from({ length: syntheticCount }, () => generateNewOrders(products))
    );

    const isReviewGenerated = Math.random() < 0.4;

    if (isReviewGenerated) {
      await generateNewReviews(products);
    }

    return {
      success: true,
      productsLength: products.length,
      ordersLength: orders.length,
      newOrdersLength: syntheticCount,
      isReviewGenerated,
      message: "Sync completed successfully, data fetched",
    }
  },
});