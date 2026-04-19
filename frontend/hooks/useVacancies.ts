import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { vacanciesApi } from '@/lib/api';
import type { Vacancy } from '@/lib/types';


export function useVacancies() {
    return useQuery<Vacancy[]>({
        queryKey: ['vacancies'],
        queryFn: async () => {
            const res = await vacanciesApi.getAll();
            return res.data;
        },
    });
}

export function useVacancy(id: string | undefined, userId?: string) {
    return useQuery<Vacancy>({
        queryKey: ['vacancy', id],
        queryFn: async () => {
            const res = await vacanciesApi.getById(id!, userId);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useMyVacancies(userId: string | undefined) {
    return useQuery<Vacancy[]>({
        queryKey: ['my-vacancies', userId],
        queryFn: async () => {
            const res = await vacanciesApi.getMyVacancies(userId!);
            return res.data;
        },
        enabled: !!userId,
    });
}


export function useCreateVacancy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: {
            title: string;
            description: string;
            requirements: string;
            salary: string;
            status: string;
        }) => vacanciesApi.create(data),
        onSuccess: () => {
            toast.success('Vakansiya muvaffaqiyatli yaratildi!');
            queryClient.invalidateQueries({ queryKey: ['my-vacancies'] });
            queryClient.invalidateQueries({ queryKey: ['vacancies'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}

export function useUpdateVacancy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title: string; description: string; requirements: string; salary: string; status: string } }) =>
            vacanciesApi.update(id, data),
        onSuccess: () => {
            toast.success('Vakansiya yangilandi!');
            queryClient.invalidateQueries({ queryKey: ['my-vacancies'] });
            queryClient.invalidateQueries({ queryKey: ['vacancies'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}

export function useDeleteVacancy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => vacanciesApi.delete(id),
        onSuccess: () => {
            toast.success("Vakansiya o'chirildi!");
            queryClient.invalidateQueries({ queryKey: ['my-vacancies'] });
            queryClient.invalidateQueries({ queryKey: ['vacancies'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}
