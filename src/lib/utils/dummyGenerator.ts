import { subMilliseconds } from "date-fns";
import prisma from "@/lib/prisma";
import { Product } from "../types";

export const randomStatus = () => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    return statuses[Math.floor(Math.random() * statuses.length)];
};

export const randomDate = (daysAgo: number = 30) => {
    const maxMs = daysAgo * 24 * 60 * 60 * 1000;

    return subMilliseconds(new Date(), Math.floor(Math.random() * maxMs));
};

export const generateNewOrders = async (products: Product[]) => {
    const totalNewOrders = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let calculatedTotal = 0;

    for (let i = 0; i < totalNewOrders; i++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;

        orderItems.push({ productId: randomProduct.product_id, quantity });
        calculatedTotal += (Number(randomProduct.price) * quantity);
    }

    const newOrder = await prisma.order.create({
        data: {
            userId: Math.floor(Math.random() * 900) + 100,
            status: randomStatus(),
            totalPrice: Number(calculatedTotal.toFixed(2)),
            createdAt: new Date(),
            syncedAt: new Date(),
        }
    });

    await Promise.all(orderItems.map(item => prisma.orderItem.create({
        data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity
        }
    })));

}

export const generateNewReviews = async (products: Product[]) => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomUserId = Math.floor(Math.random() * 9000) + 1000;
    const randomRating = Math.floor(Math.random() * 5) + 1;

    await prisma.review.create({
        data: {
            productId: randomProduct.product_id,
            userId: randomUserId,
            rating: randomRating,
            comment: "Synthetic review for dashboard activity",
            createdAt: new Date(),
        }
    });
}