"use client"

interface SolutionPageQueryParams {
  id: string;
}

interface SolutionPageProps {
  params: Promise<SolutionPageQueryParams>
}

export default async function SolutionPage({params}: SolutionPageProps) {
  const id: string = (await params).id;

  return <div>SolutionPage: {id}</div>
}
