'use client';

import Link from 'next/link';
import { Search, Eye, Users, Briefcase } from 'lucide-react';
import { useState } from 'react';
import { useVacancies } from '@/hooks/useVacancies';
import { StatusBadge } from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VacancyList() {
    const { data: vacancies = [], isLoading } = useVacancies();
    const [search, setSearch] = useState('');

    const filtered = vacancies.filter(v =>
        v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.salary.toLowerCase().includes(search.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Vakansiyalar</h1>
                <p className="text-muted-foreground mt-1">Jami: {vacancies.length} ta vakansiya</p>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Vakansiya nomi yoki maosh bo'yicha qidirish..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Vakansiyalar topilmadi</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(vacancy => (
                        <Link key={vacancy.id} href={`/candidate/vacancies/${vacancy.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="pt-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h2 className="font-semibold text-foreground truncate">{vacancy.title}</h2>
                                                <StatusBadge status={vacancy.status} />
                                            </div>
                                            {vacancy.hr?.fullName && (
                                                <p className="text-sm text-muted-foreground mb-1">{vacancy.hr.fullName}</p>
                                            )}
                                            <p className="text-accent font-medium text-sm mb-2">{vacancy.salary}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">{vacancy.description}</p>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />{vacancy.views} ko&apos;rish
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />{vacancy.applicationsCount} ariza
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
