'use client';

import Link from 'next/link';
import { FileText, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyApplications } from '@/hooks/useApplications';
import { useVacancies } from '@/hooks/useVacancies';
import { useProfile, calcProfileCompletion } from '@/hooks/useProfile';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export function CandidateDashboard() {
  const { user } = useAuth();

  const { data: applications = [], isLoading: appsLoading } = useMyApplications(user?.id);
  const { data: vacancies = [], isLoading: vacsLoading } = useVacancies();
  const { data: profile } = useProfile(user?.id);
  const completion = calcProfileCompletion(profile);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "Ko'rib chiqilmoqda").length,
    accepted: applications.filter(a => a.status === 'Qabul qilindi').length,
    rejected: applications.filter(a => a.status === 'Rad etildi').length,
  };

  if (appsLoading || vacsLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground"> {user?.fullName}!</h1>
        <p className="text-muted-foreground mt-1">Arizalaringiz va vakansiyalar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami arizalar', value: stats.total, icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: "Ko'rib chiqilmoqda", value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Qabul qilindi', value: stats.accepted, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          { label: 'Rad etildi', value: stats.rejected, icon: XCircle, color: 'bg-red-100 text-red-600' },
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
          <CardTitle>So&apos;nggi vakansiyalar</CardTitle>
          <Link href="/candidate/vacancies">
            <Button variant="ghost" size="sm" className="text-accent">
              Barchasi <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {vacancies.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Hozircha vakansiyalar yo&apos;q</p>
          ) : (
            <div className="space-y-4">
              {vacancies.slice(0, 3).map((vacancy) => (
                <Link key={vacancy.id} href={`/candidate/vacancies/${vacancy.id}`}
                  className="block p-4 rounded-lg border border-border hover:border-accent/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{vacancy.title}</h3>
                        <StatusBadge status={vacancy.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-1">{vacancy.hr?.fullName}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-accent">{vacancy.salary}</span>
                        <span className="text-muted-foreground">{vacancy.applicationsCount} ariza</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>So&apos;nggi arizalarim</CardTitle>
          <Link href="/candidate/applications">
            <Button variant="ghost" size="sm" className="text-accent">
              Barchasi <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Hali ariza topshirmadingiz</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="font-medium text-foreground">{app.Vacancy?.title}</p>
                    <p className="text-sm text-accent">{app.Vacancy?.salary}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
