'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (res) => {
      const { token, user } = res.data;
      login(token, { id: String(user.id), fullName: user.fullName, role: user.role });
      toast.success('Muvaffaqiyatli kirildi!');
      const dest = user.role === 'CANDIDATE' ? '/candidate/dashboard'
        : user.role === 'ADMIN' ? '/admin/dashboard'
          : '/hr/dashboard';
      router.push(dest);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
    },
  });

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-white mb-2">AGMK</h1>
          <div className="h-1 w-16 bg-accent mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-white mb-4">HR Portal</h2>
          <p className="text-white/80 text-lg">Karyerangizni biz bilan boshlang.</p>
          <div className="mt-8 p-4 bg-white/10 rounded-lg text-left space-y-1">
            <p className="text-white/90 text-sm font-semibold">Test loginlar:</p>
            <p className="text-white/80 text-sm">Admin: sh@agmk.uz / admin123</p>
            <p className="text-white/80 text-sm">HR: hr@agmk.uz / hr1234</p>
            <p className="text-white/80 text-sm">Candidate: testuser@mail.com / newpass123</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary">AGMK HR Portal</h1>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Tizimga kirish</h2>
          <p className="text-muted-foreground mb-8">Hisobingizga kirish uchun ma&apos;lumotlaringizni kiriting</p>

          <form onSubmit={handleSubmit(d => loginMutation.mutate(d))} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input type="email" placeholder="email@example.com"
                {...register('email', {
                  required: 'Email kiritish shart',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Noto'g'ri email" },
                })}
                className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Parol</label>
              <div className="relative">
                <Input type={showPassword ? 'text' : 'password'} placeholder="Parolingizni kiriting"
                  {...register('password', { required: 'Parol kiritish shart' })}
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-sm text-accent hover:underline">Parolni unutdingizmi?</Link>
            </div>

            <Button type="submit" disabled={loginMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              {loginMutation.isPending
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Kirish...</>
                : 'Kirish'}
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Hisobingiz yo&apos;qmi?{' '}
            <Link href="/register" className="text-accent hover:underline font-medium">Ro&apos;yxatdan o&apos;tish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
