'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
    SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'HR Mutaxassislar', path: '/admin/users' },
    { icon: User, label: 'Profil', path: '/admin/profile' },
];

export function AdminSidebar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => { logout(); router.push('/login'); };

    return (
        <Sidebar collapsible="offcanvas">
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-3">
                    <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-sidebar-foreground">AGMK HR</span>
                        <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Menyu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.path}>
                                    <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.label}>
                                        <Link href={item.path} className="flex items-center gap-2 w-full">
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <div className="flex items-center gap-2 px-2 py-2">
                            <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                                <span className="text-xs font-medium text-white">
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-sidebar-foreground truncate">{user?.fullName}</span>
                                <span className="text-xs text-sidebar-foreground/60">ADMIN</span>
                            </div>
                        </div>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Chiqish"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="h-4 w-4" />
                            <span>Chiqish</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
