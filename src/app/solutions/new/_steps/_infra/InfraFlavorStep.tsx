"use client"

import {useAtom, useAtomValue} from "jotai";
import Image from "next/image";

import {flavorAtom, flavorsAtom, personaAtom, platformAtom} from "@/atoms";
import {CloudProviderMetadata, FlavorMetadata, UseCaseMetadata} from "@/models";

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

    return (
        <div>
            <div className="selection-set">
                <form className="plans">
                    {/* <div className="title">Now you have selected your use case and the platform you want to target. Let's select the architecture pattern you want to use</div> */}
                    <div className="arch">
                        <p>You want to <strong>{persona?.displayName ?? persona?.name}</strong> {persona?.iconUrl ? <Image loading="lazy" src={persona?.iconUrl} alt={persona?.displayName ?? ""} /> : <></> }</p>
                        <p>on the platform {platform?.iconUrl ? <Image loading="lazy" src={platform?.iconUrl} alt="platform" /> : <></>} </p>
                        <p>We recommend you use the <strong>{persona?.flavor}</strong> reference architecture</p>
                    </div>
                    {
                        flavors?.length ?
                            flavors.map((flavor: FlavorMetadata) => (
                                <label className="plan complete-plan" htmlFor={flavor.name} key={flavor.name}>
                                    <input type="radio" name={flavor.name} id={flavor.name}
                                           disabled={!flavor.enabled}
                                           className={selectedFlavor?.name === flavor.name ? 'checked' : ''}
                                           onClick={() => { if (flavor.enabled) setSelectedFlavor(flavor) }} />
                                    <div className={`plan-content${flavor.enabled ? '' : ' coming-soon'}`}>
                                        <Image loading="lazy" src={flavor.iconUrl} alt="" />

                                        <div className="plan-details">
                                                                                    <span>{flavor.displayName ?? flavor.name}
                                                                                        {!flavor.enabled && <i><b><h6>Coming Soon !</h6></b></i>}
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