import { VacancyApplications } from '@/components/hr/VacancyApplications';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <VacancyApplications id={id} />;
}
