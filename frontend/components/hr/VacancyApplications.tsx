'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Mail, User, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useVacancyApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_OPTIONS = [
  { value: 'Yangi', label: 'Yangi' },
  { value: "Ko'rib chiqilmoqda", label: "Ko'rib chiqilmoqda" },
  { value: 'Qabul qilindi', label: 'Qabul qilindi' },
  { value: 'Rad etildi', label: 'Rad etildi' },
];

export function VacancyApplications({ id }: { id?: string }) {
  const params = useParams<{ id: string }>();
  const vacancyId = id ?? params?.id;
  const router = useRouter();

  const { data: applications = [], isLoading } = useVacancyApplications(vacancyId);
  const statusMutation = useUpdateApplicationStatus(vacancyId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.back()}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Arizalar</h1>
        <p className="text-muted-foreground mt-1">
          Bu vakansiyaga kelgan arizalar: {applications.length} ta
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Hali arizalar yo&apos;q</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map(app => (
            <Card key={app.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{app.candidate?.fullName}</CardTitle>
                    <a href={`mailto:${app.candidate?.email}`}
                      className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                      <Mail className="h-3 w-3" />{app.candidate?.email}
                    </a>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {app.coverLetter && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Qoplama xat:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">{app.coverLetter}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <a href={`${UPLOADS_BASE_URL}/${app.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg text-sm hover:bg-secondary/80">
                    <Download className="h-4 w-4" />CV yuklab olish
                  </a>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(app.createdAt), 'dd.MM.yyyy HH:mm')}
                  </p>
                </div>

                <Link href={`/hr/candidates/${app.userId}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Statusni o&apos;zgartirish:
                  </p>
                  <Select
                    value={app.status}
                    onValueChange={v => statusMutation.mutate({ appId: String(app.id), status: v })}
                    disabled={statusMutation.isPending}
                  >
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
