'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Users, UserPlus, Trash2, Loader2, Shield, TrendingUp } from 'lucide-react';
import { useAllUsers, useCreateUser, useDeleteUser } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

interface CreateUserForm {
    fullName: string;
    email: string;
    password: string;
    role: 'HR';
}

const ROLE_COLORS: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    HR: 'bg-blue-100 text-blue-700',
    CANDIDATE: 'bg-green-100 text-green-700',
};

const PIE_COLORS = ['#8b5cf6', '#3b82f6', '#22c55e'];

export function AdminDashboard() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: users = [], isLoading } = useAllUsers();
    const createMutation = useCreateUser();
    const deleteMutation = useDeleteUser();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>({
        defaultValues: { role: 'HR' },
    });

    const stats = {
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        hr: users.filter(u => u.role === 'HR').length,
        candidates: users.filter(u => u.role === 'CANDIDATE').length,
    };

    const pieData = [
        { name: 'Admin', value: stats.admins },
        { name: 'HR', value: stats.hr },
        { name: 'Nomzod', value: stats.candidates },
    ].filter(d => d.value > 0);


    const barData = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), 5 - i);
        const start = startOfMonth(date);
        const end = endOfMonth(date);
        const count = users.filter(u =>
            isWithinInterval(new Date(u.createdAt), { start, end })
        ).length;
        return { month: format(date, 'MMM'), count };
    });

    const onSubmit = (data: CreateUserForm) => {
        createMutation.mutate(data, {
            onSuccess: () => { reset(); setIsCreateOpen(false); },
        });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-72 rounded-xl" />
                    <Skeleton className="h-72 rounded-xl" />
                </div>
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
                    <p className="text-muted-foreground mt-1">Tizim statistikasi va foydalanuvchilar</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <UserPlus className="h-4 w-4 mr-2" />HR yaratish
                </Button>
            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Jami foydalanuvchi', value: stats.total, icon: Users, color: 'bg-gray-100 text-gray-600' },
                    { label: 'Admin', value: stats.admins, icon: Shield, color: 'bg-purple-100 text-purple-600' },
                    { label: 'HR Mutaxassis', value: stats.hr, icon: Users, color: 'bg-blue-100 text-blue-600' },
                    { label: 'Nomzodlar', value: stats.candidates, icon: Users, color: 'bg-green-100 text-green-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <Card key={label}>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-foreground">{value}</p>
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-accent" />
                            So&apos;nggi 6 oy ro&apos;yxatdan o&apos;tishlar
                        </CardTitle>
                        <CardDescription>Oylar bo&apos;yicha yangi foydalanuvchilar soni</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                                    formatter={(v) => [v, "Foydalanuvchi"]}
                                />
                                <Bar dataKey="count" fill="#F5A623" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Pie chart — rol taqsimoti */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-accent" />
                            Rol taqsimoti
                        </CardTitle>
                        <CardDescription>Foydalanuvchilar rollari bo&apos;yicha</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                                    formatter={(v, name) => [`${v} ta`, name]}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: 'hsl(var(--foreground))', fontSize: 13 }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>HR Mutaxassislar ro&apos;yxati</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border bg-secondary/50">
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">#</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Ism</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Email</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Rol</th>
                                    <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Sana</th>
                                    <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Amal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => u.role === 'HR').map((user, i) => (
                                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{i + 1}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-medium text-primary-foreground">
                                                        {user.fullName.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-foreground">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {format(new Date(user.createdAt), 'dd.MM.yyyy')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {user.role !== 'ADMIN' && (
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(user.id)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>HR Mutaxassis yaratish</DialogTitle>
                        <DialogDescription>Yangi HR hisobi yarating</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">To&apos;liq ism</label>
                            <Input placeholder="Ism Familiya"
                                {...register('fullName', { required: 'Ism kiritish shart' })}
                                className={errors.fullName ? 'border-destructive' : ''} />
                            {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                            <Input type="email" placeholder="email@example.com"
                                {...register('email', { required: 'Email kiritish shart' })}
                                className={errors.email ? 'border-destructive' : ''} />
                            {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Parol</label>
                            <Input type="password" placeholder="Kamida 6 ta belgi"
                                {...register('password', { required: 'Parol kiritish shart', minLength: { value: 6, message: 'Kamida 6 ta belgi' } })}
                                className={errors.password ? 'border-destructive' : ''} />
                            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Bekor qilish</Button>
                            <Button type="submit" disabled={createMutation.isPending}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                {createMutation.isPending
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Yaratilmoqda...</>
                                    : 'Yaratish'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>O&apos;chirishni tasdiqlang</DialogTitle>
                        <DialogDescription>Bu foydalanuvchini o&apos;chirishni xohlaysizmi? Bu amalni qaytarib bo&apos;lmaydi.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <Button variant="destructive" disabled={deleteMutation.isPending}
                            onClick={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>
                            {deleteMutation.isPending
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />O&apos;chirilmoqda...</>
                                : "O'chirish"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
