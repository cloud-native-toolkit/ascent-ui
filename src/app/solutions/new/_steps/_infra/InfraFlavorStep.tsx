"use client"

import {useAtom, useAtomValue} from "jotai";

import {flavorAtom, flavorsAtom, personaAtom, platformAtom} from "@/atoms";
import {Icon} from "@/components";
import {CloudProviderMetadata, FlavorMetadata, UseCaseMetadata} from "@/models";
import {classnames} from "@/util";

import styles from "../../page.module.scss";

interface InfraFlavorStepProps {
    visible: boolean;
    platform?: FlavorMetadata;
}

export const InfraFlavorStep = ({visible}: InfraFlavorStepProps) => {
    const persona: UseCaseMetadata | undefined = useAtomValue(personaAtom);
    const platform: CloudProviderMetadata | undefined = useAtomValue(platformAtom);
    const {data: flavors} = useAtomValue(flavorsAtom)
    const [selectedFlavor, setSelectedFlavor] = useAtom(flavorAtom);

    if (!visible) return (<></>);

    const isDisabled = (flavor: FlavorMetadata): boolean => {
        if (flavor.enabled === undefined) return false;
        return !flavor.enabled;
    }

    return (
        <div>
            <div className={styles.selectionSet}>
                <form className={styles.plans}>
                    <div className={styles.arch}>
                        <p>You want to <strong>{persona?.displayName ?? persona?.name}</strong> <Icon loading="lazy" src={persona?.iconUrl} alt={persona?.displayName ?? ""} /></p>
                        <p>on the platform <Icon src={platform?.iconUrl} alt="platform" /></p>
                        <p>We recommend you use the <strong>{persona?.flavor}</strong> reference architecture</p>
                    </div>
                    {
                        flavors?.length ?
                            flavors.map((flavor: FlavorMetadata) => (
                                <label className={classnames(styles.plan, styles.completePlan)} htmlFor={flavor.name} key={flavor.name}>
                                    <input type="radio" name={flavor.name} id={flavor.name}
                                           disabled={isDisabled(flavor)}
                                           checked={!!(selectedFlavor?.name && selectedFlavor?.name === flavor.name)}
                                           onChange={() => setSelectedFlavor(flavor)} />
                                    <div className={classnames(styles.planContent, !flavor.enabled ? styles.comingSoon : undefined)}>
                                        <Icon src={flavor.iconUrl} alt="" />

                                        <div className={styles.planDetails}>
                                            <span>{flavor.displayName ?? flavor.name}
                                                {isDisabled(flavor) && <i><b><h6>Coming Soon !</h6></b></i>}
                                            </span>
                                            <p>{flavor.description}</p>
                                        </div>
                                    </div>
                                </label>
                            )) : <p>No Architecture Pattern</p>
                    }
                </form>
            </div>
        </div>
    );
}