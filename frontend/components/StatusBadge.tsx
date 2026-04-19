'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
      case 'yangi':
      case "ko'rib chiqilmoqda":
        return 'bg-amber-100 text-amber-800';
      case 'accepted':
      case 'qabul qilindi':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'rad etildi':
        return 'bg-red-100 text-red-800';
      case 'active':
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return 'Kutilmoqda';
      case 'accepted':
        return 'Qabul qilindi';
      case 'rejected':
        return 'Rad etildi';
      case 'active':
      case 'open':
        return 'Ochiq';
      case 'closed':
      case 'inactive':
        return 'Yopiq';
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel()}
    </span>
  );
}
