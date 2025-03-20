"use client"

import {useEffect, useState} from "react";

interface ServicePageQueryParams {
  serviceId: string;
}

interface ServicePageProps {
  params: Promise<ServicePageQueryParams>
}

export default function ServicePage({params}: ServicePageProps) {
  const [serviceId, setServiceId] = useState<string>();

  useEffect(() => {
    const resolveServiceId = async () => {
      const serviceId = (await params).serviceId;

      setServiceId(serviceId);
    }
    resolveServiceId().catch(console.error);
  })

  return <div>ServicePage: {serviceId}</div>
}
