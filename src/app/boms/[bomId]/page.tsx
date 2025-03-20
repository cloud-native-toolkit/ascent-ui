"use client"

import {useEffect, useState} from "react";

interface BomDetailPageQueryParams {
    bomId: string;
}

interface BomDetailPageProps {
    params: Promise<BomDetailPageQueryParams>;
}

export default function BomDetailPage({params}: BomDetailPageProps) {
    const [bomId, setBomId] = useState<string>();

    useEffect(() => {
        const resolveBomId = async () => {
            const bomId = (await params).bomId;

            setBomId(bomId);
        }
        resolveBomId().catch(console.error);
    });

    return <div>BomDetail: {bomId}</div>
}
