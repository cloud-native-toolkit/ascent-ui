"use client"

interface NistDetailPageQueryParams {
    nistId: string;
}

interface NistDetailPageProps {
    params: Promise<NistDetailPageQueryParams>;
}

export default async function NistDetailPage({params}: NistDetailPageProps) {
    const nistId: string = (await params).nistId;

    return <div>NistDetail: {nistId}</div>
}
