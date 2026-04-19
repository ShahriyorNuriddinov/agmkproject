'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Eye, Users, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useVacancy } from '@/hooks/useVacancies';
import { useApplyToJob } from '@/hooks/useApplications';
import { useProfile, isProfileComplete } from '@/hooks/useProfile';
import { StatusBadge } from '@/components/StatusBadge';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

export function VacancyDetail({ id: propId }: { id?: string }) {
  const params = useParams<{ id: string }>();
  const id = propId ?? params?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: profile } = useProfile(user?.id);

  const { data: vacancy, isLoading } = useVacancy(id, user?.id);

  const applyMutation = useApplyToJob();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-5 w-20" />
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!vacancy) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
      </button>

      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{vacancy.title}</h1>
              <StatusBadge status={vacancy.status} />
            </div>
            <p className="text-muted-foreground">{vacancy.hr?.fullName}</p>
          </div>
          {vacancy.status === 'OPEN' && (
            <Button
              onClick={() => {
                if (!isProfileComplete(profile)) {
                  router.push('/candidate/profile');
                  return;
                }
                setIsModalOpen(true);
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Ariza yuborish
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground">Maosh</p>
            <p className="text-lg font-semibold text-accent">{vacancy.salary}</p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="h-4 w-4" /><span>{vacancy.views} ko&apos;rish</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" /><span>{vacancy.applicationsCount} ariza</span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Tavsif</h2>
            <p className="text-muted-foreground whitespace-pre-line">{vacancy.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Talablar</h2>
            <p className="text-muted-foreground whitespace-pre-line">{vacancy.requirements}</p>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ariza yuborish</DialogTitle>
            <DialogDescription>{vacancy.title} vakansiyasiga ariza yuborish</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <FileUpload
              accept=".pdf,.doc,.docx"
              maxSize={5}
              label="Rezyume (PDF/DOC/DOCX, max 5MB)"
              onFileSelect={setResumeFile}
              type="document"
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Qoplama xat (ixtiyoriy)</label>
              <Textarea placeholder="O'zingiz haqida qisqacha yozing..." value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)} rows={5} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={applyMutation.isPending}>
                Bekor qilish
              </Button>
              <Button onClick={() => {
                if (!resumeFile) return;
                const formData = new FormData();
                formData.append('vacancyId', id!);
                formData.append('coverLetter', coverLetter);
                formData.append('resume', resumeFile);
                applyMutation.mutate(formData, {
                  onSuccess: () => { setIsModalOpen(false); router.push('/candidate/applications'); },
                });
              }} disabled={applyMutation.isPending || !resumeFile}
                className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {applyMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Yuborilmoqda...</> : 'Yuborish'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
