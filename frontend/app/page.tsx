'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function RootPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user?.role === 'CANDIDATE') {
            router.replace('/candidate/dashboard');
        } else if (user?.role === 'ADMIN') {
            router.replace('/admin/dashboard');
        } else {
            router.replace('/hr/dashboard');
        }
    }, [isAuthenticated, user, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
    );
}
