'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={['ADMIN']}>
            <SidebarProvider defaultOpen={true}>
                <AdminSidebar />
                <SidebarInset>
                    <Navbar />
                    <main className="flex-1 p-4 lg:p-6 overflow-auto">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </AuthGuard>
    );
}
