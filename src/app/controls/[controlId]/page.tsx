"use client"

interface ControlDetailPageQueryParams {
    controlId: string;
}

interface ControlDetailPageProps {
    params: Promise<ControlDetailPageQueryParams>;
}

export default async function ControlDetailPage({params}: ControlDetailPageProps) {
    const controlId: string = (await params).controlId;

    return <div>ControlDetail: {controlId}</div>
}
