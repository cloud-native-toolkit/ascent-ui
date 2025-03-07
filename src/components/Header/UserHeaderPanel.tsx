"use client";

import {useAtom, useAtomValue} from "jotai";
import {Copy, HeaderPanel, Loading, SwitcherDivider, SwitcherItem, Tag, Toggle} from "@carbon/react";
import {Logout, TaskComplete} from "@carbon/icons-react";

import {copyTokenIconAtom, updateUserConfigAtom} from "@/atoms";
import {User, UserConfig} from "@/models";
import {applicationMode} from "@/util";

import "./header.component.scss";

const UserHeaderPanel = ({user, isProfileExpanded}: {user: User | undefined, isProfileExpanded: boolean}) => {
    const {mutate: setUserConfig} = useAtomValue(updateUserConfigAtom);
    const [copyTokenIcon, fetchToken] = useAtom(copyTokenIconAtom);

    if (!user) {
        return (<></>)
    }

    const userConfig: UserConfig | undefined = user.config;

    const CopyTokenIcon = () => {
        return (copyTokenIcon === 'complete' ? <TaskComplete /> : copyTokenIcon === 'fetch' ? <Loading /> : <Copy />)
    }

    return (
        <HeaderPanel aria-label="Header Panel" className="user-profile" expanded={isProfileExpanded}>
            <li className="bx--switcher__item title">
                <strong>{(user && user.name) || "Username"}</strong>
                <Tag>{(user?.role) || "role"}</Tag>
            </li>
            <li className="bx--switcher__item"><strong>{(user?.email) || "example@ibm.com"}</strong></li>
            {user?.role === 'admin' ? <li className="bx--switcher__item">
                <strong>region:</strong>
                <Tag style={{ marginLeft: '.5rem' }}>{user?.region}</Tag>
            </li> : <></>}
            {applicationMode.isBuilderMode() ? <div>
                    <SwitcherDivider />
                    <SwitcherItem aria-label="API token" onClick={() => fetchToken()}>
                        <span>API token</span><CopyTokenIcon />
                    </SwitcherItem>
                </div>

                : <></>}



            {applicationMode.isBuilderMode() && user?.role === 'admin' ?

                <div>
                    <SwitcherDivider />

                    <li className="bx--switcher__item">
                        <Toggle labelText="Compliance features" size="md" id='compliance-toggle' toggled={userConfig?.complianceFeatures} onToggle={(checked) => setUserConfig({config: { ...userConfig, complianceFeatures: checked }})} />
                    </li>
                    <li className="bx--switcher__item">
                        <Toggle labelText="Solution Builder features" size="md" id='builder-toggle' toggled={userConfig?.builderFeatures} onToggle={(checked) => setUserConfig({config: { ...userConfig, builderFeatures: checked }})} />
                    </li>
                </div>  : <></>}


            {applicationMode.isBuilderMode() && user?.role === 'admin' ? <>
                <li className="bx--switcher__item">
                    <Toggle labelText="Azure content" size="sm" id='azure-toggle' toggled={userConfig?.azureContent} onToggle={(checked) => setUserConfig({config: { ...userConfig, azureContent: checked }})} />
                </li>
                <li className="bx--switcher__item">
                    <Toggle labelText="AWS content" size="sm" id='aws-toggle' toggled={userConfig?.awsContent} onToggle={(checked) => setUserConfig({config: { ...userConfig, awsContent: checked }})} />
                </li>
            </> : <></>}

            <SwitcherDivider />
            <SwitcherItem aria-label="Logout" className="logout" href="/logout">
                <span>Logout</span>
                <Logout />
            </SwitcherItem>
        </HeaderPanel>
    )

}

export default UserHeaderPanel;
