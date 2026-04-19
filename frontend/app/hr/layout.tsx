'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { HRSidebar } from '@/components/layout/HRSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function HRLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={['HR']}>
            <SidebarProvider defaultOpen={true}>
                <HRSidebar />
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
