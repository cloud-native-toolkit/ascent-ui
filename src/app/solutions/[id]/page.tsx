"use client"

import {useEffect, useState} from "react";

interface SolutionPageQueryParams {
  id: string;
}

interface SolutionPageProps {
  params: Promise<SolutionPageQueryParams>
}

export default function SolutionPage({params}: SolutionPageProps) {
  const [id, setId] = useState<string>();

  useEffect(() => {
    const resolveId = async () => {
      const id = (await params).id;

      setId(id);
    }
    resolveId().catch(console.error);
  })

  return <div>SolutionPage: {id}</div>
}
