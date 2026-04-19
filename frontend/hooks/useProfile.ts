import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileApi, usersApi } from '@/lib/api';
import type { Profile } from '@/lib/types';

const REQUIRED_FIELDS: (keyof Profile)[] = ['phone', 'city', 'birthDate', 'position', 'experience', 'skills'];

export function calcProfileCompletion(profile: Profile | undefined): number {
    if (!profile) return 0;
    const filled = REQUIRED_FIELDS.filter(f => !!profile[f]).length;
    return Math.round((filled / REQUIRED_FIELDS.length) * 100);
}

export function isProfileComplete(profile: Profile | undefined): boolean {
    return calcProfileCompletion(profile) === 100;
}


export function useProfile(userId: string | undefined) {
    return useQuery<Profile>({
        queryKey: ['profile', userId],
        queryFn: async () => {
            const res = await profileApi.get(userId!);
            return res.data?.profile ?? res.data;
        },
        enabled: !!userId,
    });
}


export function useUpdateProfile(userId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => profileApi.update(userId!, formData),
        onSuccess: () => {
            toast.success('Profil muvaffaqiyatli saqlandi!');
            queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}

export function useUpdatePassword(userId: string | undefined) {
    return useMutation({
        mutationFn: (password: string) => usersApi.update(userId!, { password }),
        onSuccess: () => {
            toast.success("Parol muvaffaqiyatli o'zgartirildi!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}
