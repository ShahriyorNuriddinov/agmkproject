'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const password = watch('password');

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authApi.register({ fullName: data.fullName, email: data.email, password: data.password }),
    onSuccess: () => {
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      router.push('/login');
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Ro&apos;yxatdan o&apos;tish</h2>
          <p className="text-muted-foreground mb-6">Nomzod sifatida hisob yarating</p>

          <form onSubmit={handleSubmit(d => registerMutation.mutate(d))} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">To&apos;liq ism</label>
              <Input placeholder="Ism Familiya"
                {...register('fullName', { required: "To'liq ism kiritish shart", minLength: { value: 3, message: 'Kamida 3 ta belgi' } })}
                className={errors.fullName ? 'border-destructive' : ''} />
              {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input type="email" placeholder="email@example.com"
                {...register('email', { required: 'Email kiritish shart', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Noto'g'ri email" } })}
                className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parol</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="Parol yarating"
                  {...register('password', { required: 'Parol kiritish shart', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parolni tasdiqlang</label>
              <div className="relative">
                <Input type={showConfirm ? 'text' : 'password'} placeholder="Parolni qayta kiriting"
                  {...register('confirmPassword', { required: 'Tasdiqlash shart', validate: v => v === password || 'Parollar mos kelmadi' })}
                  className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" disabled={registerMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {registerMutation.isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ro&apos;yxatdan o&apos;tish...</>
                : "Ro'yxatdan o'tish"}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-accent hover:underline font-medium">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
