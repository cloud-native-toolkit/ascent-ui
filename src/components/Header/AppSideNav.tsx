"use client"

import {ReactNode} from "react";
import {useRouter} from "next/navigation";
import {SideNav, SideNavItems, SideNavMenu, SideNavMenuItem} from "@carbon/react";
import {Launch, Locked} from "@carbon/icons-react";
import {useAtom, useAtomValue} from "jotai";

import {activeItemAtom} from "@/atoms";
import { User } from "@/models";
import {applicationMode} from "@/util";

const LinkSideNavItem = ({disabled, children, href, hideDisabled}: {disabled?: boolean, href: string, hideDisabled?: boolean, children: ReactNode}) => {
    const [activeItem, setActiveItem] = useAtom(activeItemAtom);
    const router = useRouter();

    if (disabled) {
        if (hideDisabled) {
            return (<></>)
        }

        return (
            <SideNavMenuItem>
                {children}
                <Locked style={{ marginLeft: "auto" }} />
            </SideNavMenuItem>
        )
    } else {
        return (
            <SideNavMenuItem
                isActive={activeItem === href}
                onClick={() => {setActiveItem(href); router.push(href)}}>
                {children}
            </SideNavMenuItem>
        )
    }
}

const ExternalSideNavItem = ({disabled, children, href}: {children: ReactNode, href: string, disabled?: boolean}) => {
    if (disabled) {
        return (<></>)
    }

    return (
        <SideNavMenuItem
            href={href}
            target="_blank" rel="noopener noreferrer">
            {children}
            <Launch />
        </SideNavMenuItem>
    )
}

const AppSideNav = ({isSideNavExpanded, user}: {isSideNavExpanded: boolean, user: User | undefined}) => {
    const activeItem = useAtomValue(activeItemAtom);

    const isIBMUser = (user: User | undefined) => {
        return user?.email?.endsWith('ibm.com');
    }

    const issueLink = applicationMode.isBuilderMode()
        ? "https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=NoeSamaille&labels=ascent&template=issue-bug-report-on-ascent-tool.md&title=Issue+on+Ascent%3A+%7Bissue%7D"
        : "https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=NoeSamaille&labels=controls&template=controls-issue.md&title=Issue+on+Controls%3A+%7Bissue%7D";

    return (
        <SideNav aria-label="Side navigation" expanded={isSideNavExpanded} >
            <SideNavItems>
                <LinkSideNavItem href="/">{applicationMode.isFsControlsMode() ? 'Controls Catalog' : 'Overview'}</LinkSideNavItem>

                {applicationMode.isBuilderMode() ? <SideNavMenu defaultExpanded title="Solutions">
                    <LinkSideNavItem href="/solutions/user" disabled={!user}>Created Solutions</LinkSideNavItem>
                    <LinkSideNavItem href="/solutions" disabled={!user}>Public Solutions</LinkSideNavItem>
                </SideNavMenu> : <></>}

                {applicationMode.isBuilderMode() ? <SideNavMenu title="Reference Architectures" defaultExpanded >
                    <LinkSideNavItem href="/boms/infrastructure" disabled={!user}>Infrastructure</LinkSideNavItem>
                    <LinkSideNavItem href="/boms/software" disabled={!user}>Software</LinkSideNavItem>
                </SideNavMenu> : <></>}

                <SideNavMenu title="Compliance" defaultExpanded >
                    <LinkSideNavItem href="/controls" disabled={!user}>Controls</LinkSideNavItem>
                    <LinkSideNavItem href="/mapping" disabled={!user}>Mapping</LinkSideNavItem>
                    <LinkSideNavItem href="/nists" disabled={!user}>NIST 800-53</LinkSideNavItem>
                </SideNavMenu>

                {applicationMode.isBuilderMode() ? <SideNavMenu title="Automation Catalog">
                    <ExternalSideNavItem disabled={!isIBMUser(user)} href="https://pages.github.ibm.com/Ondrej-Svec2/ibm-software-map">IBM Software Portfolio</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://modules.techzone.ibm.com">Automation Modules</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://github.com/cloud-native-toolkit/software-everywhere/issues/new?assignees=seansund&labels=new_module&template=new-module.md&title=Request+new+module%3A+%7Bname%7D">
                        Create a Module
                    </ExternalSideNavItem>
                </SideNavMenu> : <></>}

                {applicationMode.isBuilderMode() ? <SideNavMenu title="Documentation"
                                                                isSideNavExpanded={isSideNavExpanded}
                                                                defaultExpanded={['/docs'].includes(activeItem)}
                                                                isActive={['/docs'].includes(activeItem)} >
                    <LinkSideNavItem href="/docs" disabled={!isIBMUser(user)} hideDisabled={true}>About</LinkSideNavItem>
                    <ExternalSideNavItem href="https://www.ibm.com/training/cloud/jobroles">Free IBM Cloud Training</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://landscape.cncf.io/">Cloud-Native Landscape</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://cloudnativetoolkit.dev/">Cloud-Native Toolkit</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://github.com/cloud-native-toolkit/iascable">Builder CLI</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://modules.techzone.ibm.com/#/how-to/gitops">Create a GitOps Module</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://modules.techzone.ibm.com/#/how-to/terraform">Create a Terraform Module</ExternalSideNavItem>
                </SideNavMenu>  : <></>}

                {applicationMode.isBuilderMode() ? <SideNavMenu title="Join Us" >
                    <ExternalSideNavItem href="https://github.com/cloud-native-toolkit">Git Organization</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://discord.gg/7sSY9W2cZf">Discord Community</ExternalSideNavItem>
                    <ExternalSideNavItem href="https://www.youtube.com/c/CloudNativeToolkit">Youtube Channel</ExternalSideNavItem>
                </SideNavMenu>  : <></>}

                <ExternalSideNavItem href={issueLink}>An Issue?</ExternalSideNavItem>
            </SideNavItems>
        </SideNav>
    )
}

export default AppSideNav;
