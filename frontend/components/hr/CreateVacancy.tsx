'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateVacancy } from '@/hooks/useVacancies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VacancyFormData {
  title: string;
  description: string;
  requirements: string;
  salary: string;
  status: 'OPEN' | 'CLOSED';
}

export function CreateVacancy() {
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VacancyFormData>({
    defaultValues: { status: 'OPEN' },
  });

  const status = watch('status');

  const mutation = useCreateVacancy();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" />Orqaga
      </button>

      <div className="bg-card rounded-xl border border-border p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Yangi vakansiya yaratish</h1>

        <form onSubmit={handleSubmit(d => mutation.mutate(d, { onSuccess: () => router.push('/hr/vacancies') }))} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Vakansiya nomi</label>
            <Input placeholder="masalan: Frontend Developer"
              {...register('title', { required: 'Vakansiya nomi kiritish shart' })}
              className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tavsif</label>
            <Textarea placeholder="Ish o'rni haqida batafsil ma'lumot..." rows={5}
              {...register('description', { required: 'Tavsif kiritish shart' })}
              className={errors.description ? 'border-destructive' : ''} />
            {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Talablar</label>
            <Textarea placeholder="Nomzodga qo'yiladigan talablar..." rows={5}
              {...register('requirements', { required: 'Talablar kiritish shart' })}
              className={errors.requirements ? 'border-destructive' : ''} />
            {errors.requirements && <p className="mt-1 text-sm text-destructive">{errors.requirements.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Maosh (so&apos;m)</label>
            <Input placeholder="masalan: 5 000 000 so'm"
              {...register('salary', { required: 'Maosh kiritish shart' })}
              className={errors.salary ? 'border-destructive' : ''} />
            {errors.salary && <p className="mt-1 text-sm text-destructive">{errors.salary.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
            <Select value={status} onValueChange={v => setValue('status', v as 'OPEN' | 'CLOSED')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Ochiq</SelectItem>
                <SelectItem value="CLOSED">Yopiq</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={mutation.isPending}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {mutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Yaratilmoqda...</> : 'Yaratish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
