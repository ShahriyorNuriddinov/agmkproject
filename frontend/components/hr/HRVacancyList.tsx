'use client';

import Link from 'next/link';
import { Plus, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { useMyVacancies } from '@/hooks/useVacancies';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function HRVacancyList() {
    const { user } = useAuth();
    const { data: vacancies = [], isLoading } = useMyVacancies(user?.id);

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
                                    <Link href={`/hr/vacancies/${vacancy.id}/applications`}>
                                        <Button variant="outline" size="sm">Arizalar</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
