"use client"

import {useAtom, useAtomValue} from "jotai";

import {cloudProvidersAtom, platformAtom} from "@/atoms";
import {Icon} from "@/components";
import {CloudProviderMetadata} from "@/models";
import {classnames} from "@/util";

import byoInfra from '../../../../../images/platforms/cloud-infra-center-byo-infra.svg';

import styles from "../../page.module.scss";

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
            <div className={styles.selectionSet}>
                <form className={classnames(styles.plans, styles.platform)}>
                    <div className={styles.title}>Now you have selected an outcome aligned with your use case. You now want to
                        select the platform you want to target. This will be the compute layer of your solution
                    </div>
                    {
                        cloudProviders?.length ?
                            cloudProviders.map((cloudProvider: CloudProviderMetadata) => (
                                <label className={classnames(styles.plan, styles.completePlan)} htmlFor={cloudProvider.name} key={cloudProvider.name}>
                                    <input
                                        type="radio"
                                        name={cloudProvider.name}
                                        id={cloudProvider.name}
                                        checked={!!(platform?.name && platform?.name === cloudProvider.name)}
                                        onChange={() => setPlatform(cloudProvider) } />
                                    <div className={classnames(styles.planContent, styles.shifted)}>
                                        <Icon src={cloudProvider.iconUrl} alt="" />
                                        <div className={styles.planDetails}>
                                            <span>{cloudProvider.displayName ?? cloudProvider.name}</span>
                                            <p>{cloudProvider.description}</p>
                                        </div>
                                    </div>
                                </label>

                            )) : <p>No Platforms</p>
                    }
                    <label className={classnames(styles.plan, styles.completePlan)} htmlFor='byo-infra' key='byo-infra'>
                        <input
                            type="radio"
                            name='byo-infra'
                            id='byo-infra'
                            checked={!!(platform?.name && platform?.name === byoInfraProvider.name)}
                            onChange={() => setPlatform(byoInfraProvider)} />
                        <div className={classnames(styles.planContent, styles.shifted)}>
                            <Icon src={byoInfra} alt="" />
                            <div className={styles.planDetails}>
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