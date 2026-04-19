'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/candidate/dashboard' },
  { icon: Briefcase, label: 'Vakansiyalar', path: '/candidate/vacancies' },
  { icon: FileText, label: 'Arizalarim', path: '/candidate/applications' },
  { icon: Bell, label: 'Bildirishnomalar', path: '/candidate/notifications' },
  { icon: User, label: 'Profil', path: '/candidate/profile' },
];

export function CandidateSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: notifications = [] } = useNotifications(user?.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-8 w-8 bg-sidebar-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-sidebar-primary-foreground font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">AGMK HR</span>
            <span className="text-xs text-sidebar-foreground/60">Nomzod Panel</span>
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
                      {item.path === '/candidate/notifications' && unreadCount > 0 && (
                        <span className="ml-auto h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
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
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                <span className="text-xs font-medium text-primary-foreground">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-sidebar-foreground truncate">{user?.fullName}</span>
                <span className="text-xs text-sidebar-foreground/60">Nomzod</span>
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
