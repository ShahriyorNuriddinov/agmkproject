'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile, useUpdatePassword } from '@/hooks/useProfile';
import { UPLOADS_BASE_URL } from '@/lib/api';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileFormData {
  phone: string; city: string; birthDate: string; currentJob: string;
  position: string; experience: string; skills: string; bio: string; department: string;
}

interface PasswordFormData {
  newPassword: string; confirmPassword: string;
}

export function ProfilePage() {
  const { user } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const profileForm = useForm<ProfileFormData>();
  const passwordForm = useForm<PasswordFormData>();
  const newPassword = passwordForm.watch('newPassword');

  const { data: profile, isLoading } = useProfile(user?.id);
  const profileMutation = useUpdateProfile(user?.id);
  const passwordMutation = useUpdatePassword(user?.id);

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        phone: profile.phone || '',
        city: profile.city || '',
        birthDate: profile.birthDate || '',
        currentJob: profile.currentJob || '',
        position: profile.position || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
        bio: profile.bio || '',
        department: profile.department || '',
      });
    }
  }, [profile, profileForm]);

  const handleProfileSubmit = (data: ProfileFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
    if (avatarFile) formData.append('avatar', avatarFile);
    if (resumeFile) formData.append('resume', resumeFile);
    profileMutation.mutate(formData);
  };

  const handlePasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }
    passwordMutation.mutate(data.newPassword, {
      onSuccess: () => passwordForm.reset(),
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="rounded-xl border p-6 space-y-5">
          <Skeleton className="h-6 w-40" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-20 w-20 rounded-full shrink-0" />
            <Skeleton className="h-20 flex-1 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-24 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Profil</h1>
        <p className="text-muted-foreground mt-1">Shaxsiy ma&apos;lumotlaringizni boshqaring</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-5">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={`${UPLOADS_BASE_URL}/${profile.avatarUrl}`} alt="Avatar" className="h-20 w-20 object-cover" />
                ) : (
                  <User className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <FileUpload accept=".jpg,.jpeg,.png,.webp" maxSize={5}
                label="Profil rasmini o'zgartirish" onFileSelect={setAvatarFile} type="image" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Ism</label>
              <Input value={user?.fullName || ''} disabled className="bg-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Telefon</label>
                <Input {...profileForm.register('phone')} placeholder="+998 90 123 45 67" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shahar</label>
                <Input {...profileForm.register('city')} placeholder="Toshkent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tug&apos;ilgan sana</label>
                <Input type="date" {...profileForm.register('birthDate')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Joriy ish joyi</label>
                <Input {...profileForm.register('currentJob')} placeholder="Kompaniya nomi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Lavozim</label>
                <Input {...profileForm.register('position')} placeholder="Frontend Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tajriba (yil)</label>
                <Input type="number" {...profileForm.register('experience')} placeholder="2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bo&apos;lim</label>
                <Input {...profileForm.register('department')} placeholder="IT bo'limi" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ko&apos;nikmalar</label>
                <Input {...profileForm.register('skills')} placeholder="React, Node.js, TypeScript" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <Textarea {...profileForm.register('bio')} placeholder="O'zingiz haqingizda..." rows={4} />
            </div>

            {user?.role === 'CANDIDATE' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Rezyume</label>
                {profile?.resumeUrl && (
                  <p className="text-sm text-muted-foreground mb-2">
                    Joriy: <a href={`${UPLOADS_BASE_URL}/${profile.resumeUrl}`} target="_blank"
                      rel="noopener noreferrer" className="text-accent hover:underline">Yuklab olish</a>
                  </p>
                )}
                <FileUpload accept=".pdf,.doc,.docx" maxSize={5}
                  label="Rezyume yuklash (PDF/DOC/DOCX)" onFileSelect={setResumeFile} type="document" />
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={profileMutation.isPending}
                className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {profileMutation.isPending
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saqlanmoqda...</>
                  : 'Saqlash'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Parolni o&apos;zgartirish</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Yangi parol</label>
                <div className="relative">
                  <Input type={showNew ? 'text' : 'password'}
                    {...passwordForm.register('newPassword', { required: true, minLength: 6 })}
                    placeholder="Yangi parol" className="pr-10" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tasdiqlang</label>
                <div className="relative">
                  <Input type={showConfirm ? 'text' : 'password'}
                    {...passwordForm.register('confirmPassword', {
                      required: true,
                      validate: v => v === newPassword || 'Mos kelmadi',
                    })}
                    placeholder="Parolni tasdiqlang" className="pr-10" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={passwordMutation.isPending} className="bg-primary hover:bg-primary/90">
                {passwordMutation.isPending
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saqlanmoqda...</>
                  : "Parolni o'zgartirish"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
