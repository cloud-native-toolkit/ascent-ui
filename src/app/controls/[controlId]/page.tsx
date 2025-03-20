"use client"

import {useEffect, useState} from "react";

interface ControlDetailPageQueryParams {
    controlId: string;
}

interface ControlDetailPageProps {
    params: Promise<ControlDetailPageQueryParams>;
}

export default function ControlDetailPage({params}: ControlDetailPageProps) {
    const [controlId, setControlId] = useState<string>();

    useEffect(() => {
        const resolveControlId = async () => {
            const controlId = (await params).controlId;

            setControlId(controlId);
        }
        resolveControlId().catch(console.error);
    })

    return <div>ControlDetail: {controlId}</div>
}
