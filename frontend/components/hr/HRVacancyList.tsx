'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVacancies, useUpdateVacancy, useDeleteVacancy } from '@/hooks/useVacancies';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Vacancy } from '@/lib/types';

interface VacancyFormData {
    title: string;
    description: string;
    requirements: string;
    salary: string;
    status: 'OPEN' | 'CLOSED';
}

export function HRVacancyList() {
    const { user } = useAuth();
    const { data: vacancies = [], isLoading } = useMyVacancies(user?.id);
    const updateMutation = useUpdateVacancy();
    const deleteMutation = useDeleteVacancy();

    const [editVacancy, setEditVacancy] = useState<Vacancy | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<VacancyFormData>();
    const status = watch('status');

    const openEdit = (v: Vacancy) => {
        setEditVacancy(v);
        reset({ title: v.title, description: v.description, requirements: v.requirements, salary: v.salary, status: v.status as 'OPEN' | 'CLOSED' });
    };

    const onEditSubmit = (data: VacancyFormData) => {
        if (!editVacancy) return;
        updateMutation.mutate({ id: String(editVacancy.id), data }, { onSuccess: () => setEditVacancy(null) });
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-9 w-36" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Vakansiyalarim</h1>
                    <p className="text-muted-foreground mt-1">Jami: {vacancies.length} ta vakansiya</p>
                </div>
                <Link href="/hr/vacancies/create">
                    <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Plus className="h-4 w-4 mr-2" />Yangi vakansiya
                    </Button>
                </Link>
            </div>

            {vacancies.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Hali vakansiya yaratmadingiz</p>
                        <Link href="/hr/vacancies/create">
                            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                <Plus className="h-4 w-4 mr-2" />Vakansiya yaratish
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {vacancies.map(vacancy => (
                        <Card key={vacancy.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="font-semibold text-foreground truncate">{vacancy.title}</h2>
                                            <StatusBadge status={vacancy.status} />
                                        </div>
                                        <p className="text-accent font-medium text-sm mb-2">{vacancy.salary}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{vacancy.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <FileText className="h-3 w-3" />{vacancy.applicationsCount} ariza
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />{vacancy.views} ko&apos;rish
                                            </span>
                                            <span>{format(new Date(vacancy.createdAt), 'dd.MM.yyyy')}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link href={`/hr/vacancies/${vacancy.id}/applications`}>
                                            <Button variant="outline" size="sm">Arizalar</Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" onClick={() => openEdit(vacancy)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => setDeleteId(String(vacancy.id))}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit dialog */}
            <Dialog open={!!editVacancy} onOpenChange={() => setEditVacancy(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Vakansiyani tahrirlash</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4 mt-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Vakansiya nomi</label>
                            <Input {...register('title', { required: true })} className={errors.title ? 'border-destructive' : ''} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Tavsif</label>
                            <Textarea rows={3} {...register('description', { required: true })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Talablar</label>
                            <Textarea rows={3} {...register('requirements', { required: true })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Maosh</label>
                            <Input {...register('salary', { required: true })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <Select value={status} onValueChange={v => setValue('status', v as 'OPEN' | 'CLOSED')}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="OPEN">Ochiq</SelectItem>
                                    <SelectItem value="CLOSED">Yopiq</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditVacancy(null)}>Bekor qilish</Button>
                            <Button type="submit" disabled={updateMutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                                {updateMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saqlanmoqda...</> : 'Saqlash'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>O&apos;chirishni tasdiqlang</DialogTitle>
                        <DialogDescription>Bu vakansiyani o&apos;chirishni xohlaysizmi?</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
                        <Button variant="destructive" disabled={deleteMutation.isPending}
                            onClick={() => { if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) }); }}>
                            {deleteMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />O&apos;chirilmoqda...</> : "O'chirish"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
