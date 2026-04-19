'use client';

import Link from 'next/link';
import { Briefcase, Users, CheckCircle, Bell, ArrowRight, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVacancies } from '@/hooks/useVacancies';
import { useNotifications } from '@/hooks/useNotifications';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export function HRDashboard() {
  const { user } = useAuth();

  const { data: vacancies = [], isLoading: vacsLoading } = useMyVacancies(user?.id);
  const { data: notifications = [] } = useNotifications(user?.id);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeVacancies = vacancies.filter(v => v.status === 'OPEN').length;

  if (vacsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const totalApplications = vacancies.reduce((sum, v) => sum + (v.applicationsCount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Xush kelibsiz, {user?.fullName}!</h1>
        <p className="text-muted-foreground mt-1">HR boshqaruv paneli</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Faol vakansiyalar', value: activeVacancies, icon: Briefcase, color: 'bg-green-100 text-green-600' },
          { label: 'Jami arizalar', value: totalApplications, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { label: 'Jami vakansiyalar', value: vacancies.length, icon: CheckCircle, color: 'bg-amber-100 text-amber-600' },
          { label: 'Yangi xabarlar', value: unreadCount, icon: Bell, color: 'bg-red-100 text-red-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Vakansiyalarim</CardTitle>
          <Link href="/hr/vacancies">
            <Button variant="ghost" size="sm" className="text-accent">
              Barchasi <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {vacancies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Hali vakansiya yaratmadingiz</p>
              <Link href="/hr/vacancies/create">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Vakansiya yaratish</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vacancies.slice(0, 5).map(vacancy => (
                <Link key={vacancy.id} href={`/hr/vacancies/${vacancy.id}/applications`}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{vacancy.title}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="text-accent font-medium">{vacancy.salary}</span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />{vacancy.applicationsCount} ariza
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={vacancy.status} />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>So&apos;nggi bildirishnomalar</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Bildirishnomalar yo&apos;q</p>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map(n => (
                <div key={n.id} className={`p-3 rounded-lg ${!n.isRead ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-secondary/50'}`}>
                  <p className={`text-sm ${!n.isRead ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(n.createdAt), 'dd.MM.yyyy HH:mm')}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
