import prisma from '@/lib/prisma';
import { calculateTrend } from '@/lib/utils/calculateTrends';
import { Prisma } from '@prisma/client';
import { subDays } from 'date-fns';

interface DateRangeProps {
    current: Prisma.DateTimeFilter;
    previous: Prisma.DateTimeFilter;
}

const getRevenue = async ({ current, previous }: DateRangeProps) => {
    const [curr, prev] = await Promise.all([
        prisma.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: current } }),
        prisma.order.aggregate({ _sum: { totalPrice: true }, where: { createdAt: previous } })
    ]);

    const currentRevenue = curr._sum.totalPrice?.toNumber() || 0;
    const previousRevenue = prev._sum.totalPrice?.toNumber() || 0;

    return { value: currentRevenue, trend: calculateTrend(currentRevenue, previousRevenue) };
}

const getOrderCount = async ({ current, previous }: DateRangeProps) => {
    const [curr, prev] = await Promise.all([
        prisma.order.count({ where: { createdAt: current } }),
        prisma.order.count({ where: { createdAt: previous } })
    ]);

    return { value: curr, trend: calculateTrend(curr, prev) };
}

const getAverageOrder = async ({ current, previous }: DateRangeProps) => {
    const [curr, prev] = await Promise.all([
        prisma.order.aggregate({ _avg: { totalPrice: true }, where: { createdAt: current } }),
        prisma.order.aggregate({ _avg: { totalPrice: true }, where: { createdAt: previous } })
    ]);

    const currentAverage = curr._avg.totalPrice?.toNumber() || 0;
    const previousAverage = prev._avg.totalPrice?.toNumber() || 0;

    return { value: currentAverage, trend: calculateTrend(currentAverage, previousAverage) };
}

const getRating = async ({ current, previous }: DateRangeProps) => {
    const [curr, prev] = await Promise.all([
        prisma.review.aggregate({ _avg: { rating: true }, where: { createdAt: current } }),
        prisma.review.aggregate({ _avg: { rating: true }, where: { createdAt: previous } })
    ]);

    const currentRating = curr._avg.rating || 0;
    const previousRating = prev._avg.rating || 0;

    return { value: currentRating, trend: calculateTrend(currentRating, previousRating) };
}

export const getDashboardMetrics = async () => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const last30DaysFilter = { gte: thirtyDaysAgo };
    const previous30DaysFilter = { gte: sixtyDaysAgo, lt: thirtyDaysAgo };

    const [revenue, orders, averageOrder, rating] = await Promise.all([
        getRevenue({ current: last30DaysFilter, previous: previous30DaysFilter }),
        getOrderCount({ current: last30DaysFilter, previous: previous30DaysFilter }),
        getAverageOrder({ current: last30DaysFilter, previous: previous30DaysFilter }),
        getRating({ current: last30DaysFilter, previous: previous30DaysFilter })
    ]);

    return {
        revenue,
        orders,
        averageOrder,
        rating
    };
}