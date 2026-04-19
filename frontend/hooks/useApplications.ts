import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { applicationsApi } from '@/lib/api';
import type { Application } from '@/lib/types';


export function useMyApplications(userId: string | undefined) {
    return useQuery<Application[]>({
        queryKey: ['my-applications', userId],
        queryFn: async () => {
            const res = await applicationsApi.getMyApplications(userId!);
            return res.data;
        },
        enabled: !!userId,
    });
}

export function useVacancyApplications(vacancyId: string | undefined) {
    return useQuery<Application[]>({
        queryKey: ['vacancy-applications', vacancyId],
        queryFn: async () => {
            const res = await applicationsApi.getVacancyApplications(vacancyId!);
            return res.data;
        },
        enabled: !!vacancyId,
    });
}


export function useApplyToJob() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => applicationsApi.apply(formData),
        onSuccess: () => {
            toast.success('Ariza muvaffaqiyatli yuborildi!');
            queryClient.invalidateQueries({ queryKey: ['my-applications'] });
            queryClient.invalidateQueries({ queryKey: ['vacancies'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}

export function useUpdateApplicationStatus(vacancyId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appId, status }: { appId: string; status: string }) =>
            applicationsApi.updateStatus(appId, status),
        onSuccess: () => {
            toast.success('Status yangilandi. Nomzodga bildirishnoma yuborildi!');
            queryClient.invalidateQueries({ queryKey: ['vacancy-applications', vacancyId] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}
