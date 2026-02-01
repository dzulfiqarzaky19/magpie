import prisma from '@/lib/prisma';

export async function getOrdersByStatus() {
    const statusCounts = await prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
    });
    return statusCounts.map(item => ({
        name: item.status,
        value: item._count.status,
    }));
}

export async function getRecentOrders() {
    return await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true }
    });
}
