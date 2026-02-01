import prisma from '@/lib/prisma';
import { Product, Review } from '@/lib/types';
import { randomDate } from '@/lib/utils/dummyGenerator';

export async function productUpsert(product: Product) {
    const { product_id, name, description, price, rating, image, category, unit, discount, availability, brand, reviews } = product;

    return await prisma.product.upsert({
        where: { id: product_id },
        update: {
            name,
            description,
            price,
            rating,
            image,
            category,
            unit,
            discount,
            availability,
            brand,
            syncedAt: new Date(),
        },
        create: {
            id: product_id,
            name,
            description,
            price,
            rating,
            image,
            category,
            unit,
            discount,
            availability,
            brand,
            syncedAt: new Date(),
        },
    });
}

const reviewUpsert = async (review: Review, productId: number) => {
    const { user_id, rating, comment } = review;

    return await prisma.review.upsert({
        where: {
            productId_userId: {
                productId,
                userId: user_id,
            },
        },
        update: {
            rating,
            comment,
        },
        create: {
            productId,
            userId: user_id,
            rating,
            comment,
            createdAt: randomDate(60),
        },
    });
}

export const syncProduct = async (products: Product[]) => {
    await Promise.all(products.map((product) => productUpsert(product)));

    const allReviews = products.flatMap((product) =>
        (product.reviews || []).map((review) => ({ ...review, productId: product.product_id }))
    );

    await Promise.all(allReviews.map((review) => reviewUpsert(review, review.productId)));
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