import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { notificationsApi } from '@/lib/api';
import type { Notification } from '@/lib/types';


export function useNotifications(userId: string | undefined) {
    return useQuery<Notification[]>({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            const res = await notificationsApi.getAll(userId!);
            return res.data;
        },
        enabled: !!userId,
        refetchInterval: 30_000,
    });
}


export function useMarkAsRead(userId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => notificationsApi.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
    });
}

export function useMarkAllAsRead(userId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationsApi.markAllAsRead(userId!),
        onSuccess: () => {
            toast.success("Barcha bildirishnomalar o'qildi deb belgilandi");
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        },
    });
}
