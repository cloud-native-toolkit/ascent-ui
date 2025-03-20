"use client"

import {useEffect, useState} from "react";

interface NistDetailPageQueryParams {
    nistId: string;
}

interface NistDetailPageProps {
    params: Promise<NistDetailPageQueryParams>;
}

export default function NistDetailPage({params}: NistDetailPageProps) {
    const [nistId, setNistId] = useState<string>();

    useEffect(() => {
        const resolveNistId = async () => {
            const nistId = (await params).nistId;

            setNistId(nistId);
        }
        resolveNistId().catch(console.error);
    })

    return <div>NistDetail: {nistId}</div>
}
