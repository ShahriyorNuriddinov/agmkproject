'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Mail, Phone, MapPin, Briefcase, Star, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { profileApi, usersApi, UPLOADS_BASE_URL } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import type { Profile } from '@/lib/types';

export function CandidateProfileView({ userId }: { userId: string }) {
    const router = useRouter();

    const { data: profile, isLoading } = useQuery<Profile>({
        queryKey: ['candidate-profile', userId],
        queryFn: async () => {
            const res = await profileApi.get(userId);
            return (res.data?.profile ?? res.data) as Profile;
        },
        enabled: !!userId,
    });

    const { data: userInfo } = useQuery({
        queryKey: ['candidate-user', userId],
        queryFn: async () => {
            const res = await usersApi.get(userId);
            return res.data as { fullName: string; email: string };
        },
        enabled: !!userId,
    });

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-5 w-20" />
                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center gap-5">
                            <Skeleton className="h-20 w-20 rounded-full shrink-0" />
                            <div className="space-y-2">
                                <Skeleton className="h-7 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-px w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const fullName = userInfo?.fullName ?? 'Nomzod';
    const email = userInfo?.email ?? '';

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button onClick={() => router.back()}
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
            </button>

            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden">
                            {profile?.avatarUrl ? (
                                <img src={`${UPLOADS_BASE_URL}/${profile.avatarUrl}`} alt="Avatar" className="h-20 w-20 object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-primary-foreground">{fullName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
                            {profile?.position && <p className="text-muted-foreground mt-0.5">{profile.position}</p>}
                            <a href={`mailto:${email}`} className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-1">
                                <Mail className="h-3.5 w-3.5" />{email}
                            </a>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile?.phone && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Telefon</p>
                                    <p className="text-sm font-medium text-foreground">{profile.phone}</p>
                                </div>
                            </div>
                        )}
                        {profile?.city && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Shahar</p>
                                    <p className="text-sm font-medium text-foreground">{profile.city}</p>
                                </div>
                            </div>
                        )}
                        {profile?.birthDate && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tug&apos;ilgan sana</p>
                                    <p className="text-sm font-medium text-foreground">{format(new Date(profile.birthDate), 'dd.MM.yyyy')}</p>
                                </div>
                            </div>
                        )}
                        {profile?.currentJob && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Joriy ish joyi</p>
                                    <p className="text-sm font-medium text-foreground">{profile.currentJob}</p>
                                </div>
                            </div>
                        )}
                        {profile?.experience && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <Star className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tajriba</p>
                                    <p className="text-sm font-medium text-foreground">{profile.experience} yil</p>
                                </div>
                            </div>
                        )}
                        {profile?.department && (
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Bo&apos;lim</p>
                                    <p className="text-sm font-medium text-foreground">{profile.department}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {profile?.skills && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-3">Ko&apos;nikmalar</p>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills.split(',').map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-secondary rounded-full text-sm font-medium text-foreground">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {profile?.bio && (
                        <>
                            <Separator />
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-2">Bio</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                            </div>
                        </>
                    )}

                    {profile?.resumeUrl && (
                        <>
                            <Separator />
                            <a href={`${UPLOADS_BASE_URL}/${profile.resumeUrl}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="w-full gap-2">
                                    <Download className="h-4 w-4" />CV yuklab olish
                                </Button>
                            </a>
                        </>
                    )}

                    {!profile && (
                        <div className="text-center py-8">
                            <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">Bu nomzod profilini to&apos;ldirmagan</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
