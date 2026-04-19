'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (user && !allowedRoles.includes(user.role)) {
            if (user.role === 'CANDIDATE') router.replace('/candidate/dashboard');
            else if (user.role === 'ADMIN') router.replace('/admin/dashboard');
            else router.replace('/hr/dashboard');
        }
    }, [isAuthenticated, user, allowedRoles, router]);

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
        );
    }

    return <>{children}</>;
}
