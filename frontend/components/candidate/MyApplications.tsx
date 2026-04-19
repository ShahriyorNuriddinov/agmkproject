'use client';

import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useMyApplications } from '@/hooks/useApplications';
import { useAuth } from '@/contexts/AuthContext';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_TABS = [
  { label: 'Barchasi', value: 'all' },
  { label: 'Yangi', value: 'Yangi' },
  { label: "Ko'rib chiqilmoqda", value: "Ko'rib chiqilmoqda" },
  { label: 'Qabul qilindi', value: 'Qabul qilindi' },
  { label: 'Rad etildi', value: 'Rad etildi' },
];

export function MyApplications() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const { data: applications = [], isLoading } = useMyApplications(user?.id);
  const filtered = activeTab === 'all' ? applications : applications.filter(a => a.status === activeTab);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Arizalarim</h1>
        <p className="text-muted-foreground mt-1">Yuborgan arizalaringiz ro&apos;yxati</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map(tab => (
          <Button key={tab.value} variant={activeTab === tab.value ? 'default' : 'outline'} size="sm"
            onClick={() => setActiveTab(tab.value)}
            className={cn(activeTab === tab.value && 'bg-primary text-primary-foreground hover:bg-primary/90')}>
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1 text-xs">({applications.filter(a => a.status === tab.value).length})</span>
            )}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Arizalar topilmadi</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Vakansiya</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Maosh</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Rezyume</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(app => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-4">
                      <p className="font-medium text-foreground">{app.Vacancy?.title}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-accent font-medium">{app.Vacancy?.salary}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-muted-foreground text-sm">{format(new Date(app.createdAt), 'dd.MM.yyyy')}</p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-4">
                      <a href={`${UPLOADS_BASE_URL}/${app.resumeUrl}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-accent hover:underline">
                        <Download className="h-4 w-4" />Yuklab olish
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
