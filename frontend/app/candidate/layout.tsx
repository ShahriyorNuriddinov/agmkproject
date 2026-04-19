'use client';

import { AuthGuard } from '@/components/layout/AuthGuard';
import { CandidateSidebar } from '@/components/layout/CandidateSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard allowedRoles={['CANDIDATE']}>
            <SidebarProvider defaultOpen={true}>
                <CandidateSidebar />
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
