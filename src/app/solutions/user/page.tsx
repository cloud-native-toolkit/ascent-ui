"use client"

import {redirect} from 'next/navigation';
import {useAtomValue} from "jotai";

import {currentUserAtom} from "@/atoms";
import {BaseSolution} from "@/components";

export default function SolutionsUserPage() {
    const {data: user, isLoading} = useAtomValue(currentUserAtom);

    if (isLoading) {
        // TODO fix
        return <div>Loading...</div>
    }

    if (!user) {
        return redirect('/solutions')
    }

    return <BaseSolution user={user} />;
}
