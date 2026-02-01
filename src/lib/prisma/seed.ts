import prisma from './index';
import { products } from '@/const/product';
import { orders } from '@/const/order';

async function main() {
    for (const product of products) {
        await prisma.product.upsert({
            where: { id: product.product_id },
            update: {},
            create: {
                id: product.product_id,
                name: product.name,
                description: product.description,
                price: product.price,
                rating: product.rating,
                image: product.image,
                category: product.category,
                unit: product.unit,
                discount: product.discount,
                availability: product.availability,
                brand: product.brand,
                reviews: {
                    create: product.reviews?.map(review => ({
                        userId: review.user_id,
                        rating: review.rating,
                        comment: review.comment
                    })) || []
                }
            }
        });
    }

    for (const order of orders) {
        await prisma.order.upsert({
            where: { id: order.order_id },
            update: {},
            create: {
                id: order.order_id,
                userId: order.user_id,
                status: order.status,
                totalPrice: order.total_price,
                items: {
                    create: order.items.map(item => ({
                        productId: item.product_id,
                        quantity: item.quantity
                    }))
                }
            }
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
