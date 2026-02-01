import { ChartConfig } from "@/components/ui/chart";
import { color } from "./color";

export const orderChartConfig = {
    value: {
        label: "Orders",
        color: color.default,
    },
    Delivered: {
        label: "Delivered",
        color: color.delivered,
    },
    Shipped: {
        label: "Shipped",
        color: color.shipped,
    },
    Processing: {
        label: "Processing",
        color: color.processing,
    },
    Cancelled: {
        label: "Cancelled",
        color: color.cancelled,
    },
    Pending: {
        label: "Pending",
        color: color.pending,
    },
} satisfies ChartConfig

export const productChartConfig = {
    value: {
        label: "Products",
        color: color.productCategory,
    },
} satisfies ChartConfig


export const insightsChartConfig = {
    value: {
        label: "Revenue",
        color: color.insights,
    },
} satisfies ChartConfig