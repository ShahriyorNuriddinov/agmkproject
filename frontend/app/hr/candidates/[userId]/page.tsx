import { CandidateProfileView } from '@/components/hr/CandidateProfileView';

export default async function Page({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    return <CandidateProfileView userId={userId} />;
}
