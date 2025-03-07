"use client"

interface ServicePageQueryParams {
  serviceId: string;
}

interface ServicePageProps {
  params: Promise<ServicePageQueryParams>
}

export default async function ServicePage({params}: ServicePageProps) {
  const serviceId: string = (await params).serviceId;

  return <div>ServicePage: {serviceId}</div>
}
