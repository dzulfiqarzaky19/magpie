import prisma from '@/lib/prisma';

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