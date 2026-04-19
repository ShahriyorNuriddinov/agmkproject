'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const emailForm = useForm<{ email: string }>();
  const resetForm = useForm<{ newPassword: string; confirmPassword: string }>();
  const newPassword = resetForm.watch('newPassword');

  const checkEmailMutation = useMutation({
    mutationFn: (data: { email: string }) => authApi.checkEmail(data.email),
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setStep(2);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Bu email tizimda topilmadi');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: { newPassword: string }) =>
      authApi.resetPassword({ email, newPassword: data.newPassword }),
    onSuccess: () => {
      setStep(3);
      toast.success('Parol muvaffaqiyatli yangilandi!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">AGMK HR Portal</h1>
          <div className="h-1 w-16 bg-accent mx-auto mt-2"></div>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-sm border border-border">
          {step === 1 && (
            <>
              <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" />Kirish sahifasiga qaytish
              </Link>
              <h2 className="text-2xl font-bold text-foreground mb-2">Parolni tiklash</h2>
              <p className="text-muted-foreground mb-6">Ro&apos;yxatdan o&apos;tgan emailingizni kiriting</p>
              <form onSubmit={emailForm.handleSubmit(d => checkEmailMutation.mutate(d))} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input type="email" placeholder="email@example.com"
                    {...emailForm.register('email', { required: 'Email kiritish shart' })}
                    className={emailForm.formState.errors.email ? 'border-destructive' : ''} />
                  {emailForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={checkEmailMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {checkEmailMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Tekshirilmoqda...</>
                    : 'Davom etish'}
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <button onClick={() => setStep(1)}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
              </button>
              <h2 className="text-2xl font-bold text-foreground mb-2">Yangi parol o&apos;rnating</h2>
              <p className="text-muted-foreground mb-6">
                <span className="font-medium text-foreground">{email}</span> uchun yangi parol kiriting
              </p>
              <form onSubmit={resetForm.handleSubmit(d => resetPasswordMutation.mutate(d))} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Yangi parol</label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Yangi parol"
                      {...resetForm.register('newPassword', { required: 'Parol kiritish shart', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
                      className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-destructive">{resetForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Parolni tasdiqlang</label>
                  <div className="relative">
                    <Input type={showConfirm ? 'text' : 'password'} placeholder="Parolni qayta kiriting"
                      {...resetForm.register('confirmPassword', { required: 'Tasdiqlash shart', validate: v => v === newPassword || 'Parollar mos kelmadi' })}
                      className="pr-10" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={resetPasswordMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  {resetPasswordMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saqlanmoqda...</>
                    : 'Parolni yangilash'}
                </Button>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Parol yangilandi!</h2>
              <p className="text-muted-foreground mb-6">Yangi parol bilan tizimga kirishingiz mumkin.</p>
              <Button onClick={() => router.push('/login')} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Kirish sahifasiga o&apos;tish
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
