import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { subDays } from 'date-fns';

interface DateRangeProps {
    current: Prisma.DateTimeFilter;
    previous: Prisma.DateTimeFilter;
}

export async function getProductsByCategory() {
    const categoryCounts = await prisma.product.groupBy({
        by: ['category'],
        _count: { category: true },
    });
    return categoryCounts.map(item => ({
        name: item.category,
        value: item._count.category,
    }));
}

export async function getTopProducts() {
    return await prisma.product.findMany({
        take: 5,
        orderBy: { price: 'desc' },
    });
}

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

export function calculateTrend(current: number, previous: number) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

// 2. Specific Query Groups (Easy to read & debug)
async function getRevenueStats({ current, previous }: DateRangeProps) {
    const [curr, prev] = await Promise.all([
        prisma.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: current } }),
        prisma.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: previous } })
    ]);

    const currentVal = curr._sum.totalPrice?.toNumber() || 0;
    const prevVal = prev._sum.totalPrice?.toNumber() || 0;

    return { value: currentVal, trend: calculateTrend(currentVal, prevVal) };
}

async function getOrderCountStats({ current, previous }: DateRangeProps) {
    const [curr, prev] = await Promise.all([
        prisma.order.count({ where: { createdAt: current } }),
        prisma.order.count({ where: { createdAt: previous } })
    ]);

    return { value: curr, trend: calculateTrend(curr, prev) };
}

async function getAvgOrderValueStats({ current, previous }: DateRangeProps) {
    const [curr, prev] = await Promise.all([
        prisma.order.aggregate({ _avg: { totalPrice: true }, where: { createdAt: current } }),
        prisma.order.aggregate({ _avg: { totalPrice: true }, where: { createdAt: previous } })
    ]);

    const currentVal = curr._avg.totalPrice?.toNumber() || 0;
    const prevVal = prev._avg.totalPrice?.toNumber() || 0;

    return { value: currentVal, trend: calculateTrend(currentVal, prevVal) };
}

async function getRatingStats({ current, previous }: DateRangeProps) {
    const [curr, prev] = await Promise.all([
        prisma.review.aggregate({ _avg: { rating: true }, where: { createdAt: current } }),
        prisma.review.aggregate({ _avg: { rating: true }, where: { createdAt: previous } })
    ]);

    const currentVal = curr._avg.rating || 0;
    const prevVal = prev._avg.rating || 0;

    return { value: currentVal, trend: calculateTrend(currentVal, prevVal) };
}


export async function getDashboardMetrics() {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const currentFilter = { gte: thirtyDaysAgo };
    const prevFilter = { gte: sixtyDaysAgo, lt: thirtyDaysAgo };

    const [revenue, orders, avgOrder, rating] = await Promise.all([
        getRevenueStats({ current: currentFilter, previous: prevFilter }),
        getOrderCountStats({ current: currentFilter, previous: prevFilter }),
        getAvgOrderValueStats({ current: currentFilter, previous: prevFilter }),
        getRatingStats({ current: currentFilter, previous: prevFilter })
    ]);

    return {
        totalRevenue: revenue.value,
        orderCount: orders.value,
        averageOrderValue: avgOrder.value,
        averageProductRating: rating.value,
        trends: {
            revenue: revenue.trend,
            orders: orders.trend,
            avgOrderValue: avgOrder.trend,
            rating: rating.trend
        }
    };
}