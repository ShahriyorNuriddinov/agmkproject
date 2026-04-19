'use client';

import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface PasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

export function AdminProfilePage() {
    const { user } = useAuth();
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PasswordFormData>();
    const newPassword = watch('newPassword');

    const passwordMutation = useMutation({
        mutationFn: (password: string) => usersApi.update(user!.id, { password }),
        onSuccess: () => {
            toast.success("Parol muvaffaqiyatli o'zgartirildi!");
            reset();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });

    const handlePasswordSubmit = (data: PasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Parollar mos kelmadi');
            return;
        }
        passwordMutation.mutate(data.newPassword);
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Profil</h1>
                <p className="text-muted-foreground mt-1">Admin hisob ma&apos;lumotlari</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Hisob ma&apos;lumotlari</CardTitle>
                    <CardDescription>Asosiy ma&apos;lumotlar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                            <span className="text-2xl font-bold text-white">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-foreground">{user?.fullName}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <Shield className="h-3.5 w-3.5 text-purple-600" />
                                <span className="text-sm text-purple-600 font-medium">ADMIN</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">To&apos;liq ism</p>
                            <Input value={user?.fullName || ''} disabled className="bg-secondary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Parolni o&apos;zgartirish</CardTitle>
                    <CardDescription>Xavfsizlik uchun parolni muntazam yangilab turing</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Yangi parol</label>
                            <div className="relative">
                                <Input
                                    type={showNew ? 'text' : 'password'}
                                    placeholder="Kamida 6 ta belgi"
                                    {...register('newPassword', {
                                        required: 'Parol kiritish shart',
                                        minLength: { value: 6, message: 'Kamida 6 ta belgi' },
                                    })}
                                    className="pr-10"
                                />
                                <button type="button" onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="mt-1 text-sm text-destructive">{errors.newPassword.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Parolni tasdiqlang</label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Parolni qayta kiriting"
                                    {...register('confirmPassword', {
                                        required: 'Tasdiqlash shart',
                                        validate: v => v === newPassword || 'Parollar mos kelmadi',
                                    })}
                                    className="pr-10"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={passwordMutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
