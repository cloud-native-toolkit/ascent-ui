"use client";

import {
    ErrorBoundary,
    Header as CarbonHeader,
    HeaderContainer,
    HeaderGlobalBar,
    HeaderMenuButton,
    HeaderName,
    HeaderNavigation,
    SkipToContent,
} from "@carbon/react";

import Link from "next/link";
import {useAtom, useAtomValue} from "jotai";

import {currentUserAtom, profileExpandedAtom} from "@/atoms";
import AppSideNav from "@/components/Header/AppSideNav";
import UserHeaderGlobalAction from "@/components/Header/UserHeaderGlobalAction";
import UserHeaderPanel from "@/components/Header/UserHeaderPanel";
import {applicationMode} from "@/util";

import "./header.component.scss";

export const Header = () => {
    const {data: user, isLoading, isError} = useAtomValue(currentUserAtom);
    const [isProfileExpanded, setProfileExpanded] = useAtom(profileExpandedAtom);

    return (
        <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <CarbonHeader aria-label="IBM">
                    <SkipToContent />

                    <HeaderMenuButton
                        aria-label="Open menu"
                        onClick={onClickSideNavExpand}
                        isActive={isSideNavExpanded}
                    />

                    <Link href="/" passHref legacyBehavior>
                        <HeaderName prefix={applicationMode.isFsControlsMode() ? 'IBM Cloud' : 'IBM'}>{applicationMode.isFsControlsMode() ? 'Controls Catalog' : 'Deployer'}</HeaderName>
                    </Link>

                    <HeaderNavigation aria-label="navigation">
                    </HeaderNavigation>

                    <HeaderGlobalBar>
                        <UserHeaderGlobalAction user={user} isUserLoading={isLoading} isUserError={isError} isProfileExpanded={isProfileExpanded} setProfileExpanded={setProfileExpanded} />
                    </HeaderGlobalBar>

                    <UserHeaderPanel user={user} isProfileExpanded={isProfileExpanded} />

                    <ErrorBoundary>
                        <AppSideNav isSideNavExpanded={isSideNavExpanded} user={user} />
                    </ErrorBoundary>
                </CarbonHeader>
            )}
        />
    );
}
