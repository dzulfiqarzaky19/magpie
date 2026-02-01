
export const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    const diff = ((current - previous) / previous) * 100;

    return Number(diff.toFixed(0));
}
