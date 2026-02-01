import prisma from "@/lib/prisma";
import { processSalesHistory } from "@/lib/utils/processSalesHistory";
import {
    subYears
} from 'date-fns';

export const getSalesHistory = async () => {
    const now = new Date();
    const fiveYearsAgo = subYears(now, 5);

    const orders = await prisma.order.findMany({
        where: { createdAt: { gte: fiveYearsAgo } },
        select: { createdAt: true, totalPrice: true },
        orderBy: { createdAt: 'asc' }
    });

    return processSalesHistory(orders, now);
}

export const getLastSyncedTime = async () => {
    const lastOrder = await prisma.order.findFirst({
        orderBy: { syncedAt: 'desc' },
        select: { syncedAt: true }
    });
    return lastOrder?.syncedAt || new Date();
}
