export type Review = {
    user_id: number;
    rating: number;
    comment: string;
};

export type Product = {
    product_id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    unit: string;
    discount: number;
    availability: boolean;
    brand: string;
    reviews?: Review[];
};



export type OrderItem = {
    product_id: number;
    quantity: number;
};

export type dbOrderItem = OrderItem & {
    orderId: number;
}

export type Order = {
    order_id: number;
    user_id: number;
    status: string;
    total_price: number;
    items: OrderItem[];
};
