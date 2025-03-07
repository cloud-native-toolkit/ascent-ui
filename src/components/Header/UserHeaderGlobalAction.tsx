"use client"

import {User} from "@/models";
import {useRouter} from "next/navigation";
import {HeaderGlobalAction, Loading} from "@carbon/react";
import {Error, Login, UserAvatar} from "@carbon/icons-react";

interface UserHeaderGlobalActionProps {
    user?: User;
    isUserLoading?: boolean;
    isUserError?: boolean;
    isProfileExpanded: boolean,
    setProfileExpanded: (val: boolean) => void
}

const UserHeaderGlobalAction = ({user, isUserLoading, isUserError, isProfileExpanded, setProfileExpanded}: UserHeaderGlobalActionProps) => {
    const router = useRouter()

    if (isUserError) {
        return (
            <HeaderGlobalAction
                aria-label="Error loading user"
                tooltipAlignment="end">
                <Error />
            </HeaderGlobalAction>
        )
    } else if (isUserLoading) {
        return (
            <HeaderGlobalAction
                aria-label="Loading user..."
                tooltipAlignment="end">
                <Loading />
            </HeaderGlobalAction>
        )
    }

    if (user) {
        return (
            <HeaderGlobalAction
                aria-label="Profile"
                isActive={isProfileExpanded}
                onClick={() => setProfileExpanded(!isProfileExpanded) }
                tooltipAlignment="end">
                <UserAvatar />
            </HeaderGlobalAction>
        )
    } else {
        return (
            <HeaderGlobalAction
                aria-label="Login / Register"
                onClick={() => router.push("/login")}
                tooltipAlignment="end">
                <Login />
            </HeaderGlobalAction>
        );
    }
}

export default UserHeaderGlobalAction;
