import { VacancyDetail } from '@/components/candidate/VacancyDetail';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <VacancyDetail id={id} />;
}
