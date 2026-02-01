'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ONE_HOUR = 60 * 60 * 1000;

export function AutoRefresh() {
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, ONE_HOUR);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
