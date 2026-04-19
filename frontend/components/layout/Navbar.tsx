'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useProfile, calcProfileCompletion } from '@/hooks/useProfile';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const { data: notifications = [] } = useNotifications(user?.id);
  const { data: profile } = useProfile(user?.role === 'CANDIDATE' ? user?.id : undefined);
  const completion = calcProfileCompletion(profile);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => { logout(); router.push('/login'); };

  const notificationsPath =
    user?.role === 'CANDIDATE' ? '/candidate/notifications' : '/hr/notifications';

  const profilePath =
    user?.role === 'CANDIDATE' ? '/candidate/profile' :
      user?.role === 'ADMIN' ? '/admin/profile' : '/hr/profile';

  const panelTitle =
    user?.role === 'CANDIDATE' ? 'Nomzod Panel' :
      user?.role === 'ADMIN' ? 'Admin Panel' : 'HR Panel';

  return (
    <header className="h-14 flex items-center gap-2 border-b border-border bg-card px-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <span className="text-sm font-medium text-muted-foreground hidden sm:block">{panelTitle}</span>

      <div className="ml-auto flex items-center gap-2">
        {user?.role === 'CANDIDATE' && (
          <Link href="/candidate/profile"
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border bg-card hover:bg-secondary/50 transition-colors">
            <div className="w-20">
              <Progress value={completion} className="h-1.5" />
            </div>
            <span className={`text-xs font-semibold tabular-nums ${completion === 100 ? 'text-green-600' : 'text-accent'}`}>
              {completion}%
            </span>
          </Link>
        )}

        {user?.role !== 'ADMIN' && (
          <Link href={notificationsPath}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium">{user?.fullName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={profilePath} className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />Chiqish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
