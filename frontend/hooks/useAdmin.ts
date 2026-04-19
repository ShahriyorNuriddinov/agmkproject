import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi, usersApi } from '@/lib/api';

export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: 'CANDIDATE' | 'HR' | 'ADMIN';
    createdAt: string;
}


export function useAllUsers() {
    return useQuery<AdminUser[]>({
        queryKey: ['admin-users'],
        queryFn: async () => {
            const res = await usersApi.getAll();
            return res.data;
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { fullName: string; email: string; password: string; role: string }) =>
            authApi.createUser(data),
        onSuccess: () => {
            toast.success('Foydalanuvchi muvaffaqiyatli yaratildi!');
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => usersApi.delete(id),
        onSuccess: () => {
            toast.success("Foydalanuvchi o'chirildi");
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
        },
    });
}
