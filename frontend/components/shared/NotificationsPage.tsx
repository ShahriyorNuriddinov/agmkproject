'use client';

import { Bell, CheckCheck, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/useNotifications';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Notification } from '@/lib/types';

export function NotificationsPage() {
  const { user } = useAuth();

  const { data: notifications = [], isLoading } = useNotifications(user?.id);
  const markOneMutation = useMarkAsRead(user?.id);
  const markAllMutation = useMarkAllAsRead(user?.id);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bildirishnomalar</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} ta o'qilmagan xabar` : "Barcha xabarlar o'qilgan"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending} className="flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />Hammasini o&apos;qildi
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Bildirishnomalar yo&apos;q</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {notifications.map((n, i) => (
            <button key={n.id}
              onClick={() => !n.isRead && markOneMutation.mutate(String(n.id))}
              className={cn(
                'w-full text-left px-4 py-4 flex items-start gap-3 transition-colors',
                i !== notifications.length - 1 && 'border-b border-border',
                !n.isRead ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20' : 'hover:bg-secondary/50'
              )}>
              <div className="mt-0.5 shrink-0">
                {n.message.includes('Qabul') ? <CheckCircle className="h-5 w-5 text-green-500" />
                  : n.message.includes('Rad') ? <AlertCircle className="h-5 w-5 text-red-500" />
                    : <Info className="h-5 w-5 text-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-foreground', !n.isRead && 'font-semibold')}>{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!n.isRead && <div className="h-2 w-2 rounded-full bg-accent shrink-0 mt-2" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
