"use client"

import {useAtom, useAtomValue} from "jotai";

import {cloudProvidersAtom, platformAtom} from "@/atoms";
import {Icon} from "@/components";
import {CloudProviderMetadata} from "@/models";

import byoInfra from '../../../../../images/platforms/cloud-infra-center-byo-infra.svg';

interface InfraPlatformStepProps {
    visible: boolean;
}

const byoInfraProvider: CloudProviderMetadata = {
    name: "byo-infra",
    displayName: "byo-infra",
    description: "",
    iconUrl: ""
}

export const InfraPlatformStep = ({visible}: InfraPlatformStepProps) => {
    const {data: cloudProviders} = useAtomValue(cloudProvidersAtom)
    const [platform, setPlatform] = useAtom(platformAtom)

    if (!visible) {
        return (<></>)
    }

    return (
        <div>
            <div className="selection-set">
                <form className="plans platform">
                    <div className="title">Now you have selected an outcome aligned with your use case. You now want to
                        select the platform you want to target. This will be the compute layer of your solution
                    </div>
                    {
                        cloudProviders?.length ?
                            cloudProviders.map((cloudProvider: CloudProviderMetadata) => (
                                <label className="plan complete-plan" htmlFor={cloudProvider.name} key={cloudProvider.name}>
                                    <input
                                        type="radio"
                                        name={cloudProvider.name}
                                        id={cloudProvider.name}
                                        checked={!!(platform?.name && platform?.name === cloudProvider.name)}
                                        onClick={() => setPlatform(cloudProvider) } />
                                    <div className="plan-content">
                                        <Icon src={cloudProvider.iconUrl} alt="" />
                                        <div className="plan-details">
                                            <span>{cloudProvider.displayName ?? cloudProvider.name}</span>
                                            <p>{cloudProvider.description}</p>
                                        </div>
                                    </div>
                                </label>

                            )) : <p>No Platforms</p>
                    }
                    <label className="plan complete-plan" htmlFor='byo-infra' key='byo-infra'>
                        <input
                            type="radio"
                            name='byo-infra'
                            id='byo-infra'
                            checked={!!(platform?.name && platform?.name === byoInfraProvider.name)}
                            onClick={() => setPlatform(byoInfraProvider)} />
                        <div className="plan-content">
                            <Icon src={byoInfra} alt="" />
                            <div className="plan-details">
                                <span>Bring Your Own</span>
                                <p>Bring your own OpenShift infrastructure. Select only the software you want to deploy for your solution</p>
                            </div>
                        </div>
                    </label>
                </form>
            </div>
        </div>
    )
}