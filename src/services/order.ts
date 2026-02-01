import prisma from '@/lib/prisma';
import { Order, dbOrderItem } from '@/lib/types';
import { randomDate } from '@/lib/utils/dummyGenerator';


const upsertOrder = async (order: Order) => {
    const { order_id, user_id, status, total_price, items } = order;

    return await prisma.order.upsert({
        where: { externalId: order_id },
        update: {
            userId: user_id,
            status,
            totalPrice: total_price,
            syncedAt: new Date(),
        },
        create: {
            externalId: order_id,
            userId: user_id,
            status,
            totalPrice: total_price,
            createdAt: randomDate(30),
            syncedAt: new Date(),
        },
    });
}

const upsertOrderItem = async (item: dbOrderItem) => {

    const productExists = await prisma.product.findUnique({
        where: { id: item.product_id },
        select: { id: true }
    });

    if (!productExists) return null;

    return await prisma.orderItem.upsert({
        where: {
            orderId_productId: { orderId: item.orderId, productId: item.product_id },
        },
        update: { quantity: item.quantity },
        create: {
            orderId: item.orderId,
            productId: item.product_id,
            quantity: item.quantity,
        },
    })
}

export const syncOrders = async (orders: Order[]) => {
    await Promise.all(
        orders.map((o) => upsertOrder(o))
    );

    const orderIds = orders.map(o => o.order_id);
    const dbOrders = await prisma.order.findMany({
        where: { externalId: { in: orderIds } },
        select: { id: true, externalId: true }
    });

    const orderMap = new Map(dbOrders.map(o => [o.externalId, o.id]));

    const allItems = orders.flatMap(order => {
        const dbId = orderMap.get(order.order_id);

        if (!dbId) return [];

        return order.items.map(item => ({ ...item, orderId: dbId }));
    });

    await Promise.all(
        allItems.map(item =>
            upsertOrderItem(item)
        )
    );

};

export const getOrdersByStatus = async () => {
    const statusCounts = await prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
    });
    return statusCounts.map(item => ({
        name: item.status,
        value: item._count.status,
    }));
}

export const getRecentOrders = async () => {
    return await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
}
