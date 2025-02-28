"use client"

interface BomDetailPageQueryParams {
    bomId: string;
}

interface BomDetailPageProps {
    params: Promise<BomDetailPageQueryParams>;
}

export default async function BomDetailPage({params}: BomDetailPageProps) {
    const bomId: string = (await params).bomId;

    return <div>BomDetail: {bomId}</div>
}
