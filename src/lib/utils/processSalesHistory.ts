import {
    subDays, subMonths, subYears, format, startOfDay, endOfDay, startOfHour,
    eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval, eachHourOfInterval
} from 'date-fns';

const initializeTimeMaps = (now: Date) => {
    const daily = new Map<string, number>();
    const monthly = new Map<string, number>();
    const yearly = new Map<string, number>();
    const hourly = new Map<string, number>();

    const days = eachDayOfInterval({
        start: subDays(now, 30),
        end: now
    });

    days.forEach(day => {
        daily.set(format(day, 'yyyy-MM-dd'), 0);

        const isToday = format(day, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
        const endHour = isToday ? now : endOfDay(day);

        const hoursInDay = eachHourOfInterval({
            start: startOfDay(day),
            end: endHour
        });

        hoursInDay.forEach(hour => {
            hourly.set(format(hour, "yyyy-MM-dd'T'HH:00"), 0);
        });
    });

    const months = eachMonthOfInterval({
        start: subMonths(now, 11),
        end: now
    });

    months.forEach(month => {
        monthly.set(format(month, 'yyyy-MM'), 0);
    });

    const years = eachYearOfInterval({
        start: subYears(now, 4),
        end: now
    });

    years.forEach(year => {
        yearly.set(format(year, 'yyyy'), 0);
    });

    return { daily, monthly, yearly, hourly };
}

interface SalesData {
    createdAt: Date;
    totalPrice: { toNumber: () => number } | number;
}

export const processSalesHistory = (orders: SalesData[], now: Date = new Date()) => {
    const { daily, monthly, yearly, hourly } = initializeTimeMaps(now);

    orders.forEach(order => {
        const date = order.createdAt;
        const val = typeof order.totalPrice === 'number'
            ? order.totalPrice
            : order.totalPrice.toNumber();

        const dayKey = format(date, 'yyyy-MM-dd');
        const hourKey = format(startOfHour(date), "yyyy-MM-dd'T'HH:00");
        const monthKey = format(date, 'yyyy-MM');
        const yearKey = format(date, 'yyyy');

        if (daily.has(dayKey)) daily.set(dayKey, (daily.get(dayKey) || 0) + val);
        if (hourly.has(hourKey)) hourly.set(hourKey, (hourly.get(hourKey) || 0) + val);
        if (monthly.has(monthKey)) monthly.set(monthKey, (monthly.get(monthKey) || 0) + val);
        if (yearly.has(yearKey)) yearly.set(yearKey, (yearly.get(yearKey) || 0) + val);
    });

    return {
        hourly: Array.from(hourly.entries()).map(([date, value]) => ({
            name: format(new Date(date), 'h:mm a'),
            date: date.split('T')[0],
            value,
            fullDate: date
        })).sort((a, b) => a.fullDate.localeCompare(b.fullDate)),

        daily: Array.from(daily.entries()).map(([date, value]) => ({
            name: format(new Date(date), 'MMM d'),
            date,
            value
        })),

        monthly: Array.from(monthly.entries()).map(([date, value]) => ({
            name: format(new Date(date + '-01'), 'MMM yyyy'),
            value
        })),

        yearly: Array.from(yearly.entries()).map(([date, value]) => ({
            name: date,
            value
        }))
    };
}
