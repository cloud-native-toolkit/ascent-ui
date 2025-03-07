"use client"

import {Column, FlexGrid, Row} from "@carbon/react";
import {useAtomValue} from "jotai";

import {flavorAtom, newSolutionAtom, personaAtom, platformAtom, softwareAtom, storageAtom} from "@/atoms";

import openshiftImg from '../../../../images/openshift.png';
import {Icon} from "@/components";

import styles from '../page.module.scss';

interface SummaryStepProps {
    visible: boolean;
}

export const SummaryStep = ({visible}: SummaryStepProps) => {
    const persona = useAtomValue(personaAtom);
    const platform = useAtomValue(platformAtom);
    const flavor = useAtomValue(flavorAtom);
    const storage = useAtomValue(storageAtom);
    const software = useAtomValue(softwareAtom);
    const solution = useAtomValue(newSolutionAtom);

    if (!visible) return (<></>);

    return (
        <FlexGrid className={styles.wizardGrid}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>Summary: Is this the solution you want?</h3>

                    <div className={styles.summary}>

                        <p>You have chosen to create an IBM Technology solution called <strong>{solution?.name}</strong></p>

                        <div className={styles.arch}>
                            <p>You want to <strong>{persona?.displayName}</strong> <Icon src={persona?.iconUrl} alt={persona?.displayName ?? ""} /></p>
                            <p>You chose to deploy you solution on <strong>{platform?.displayName}</strong> <Icon src={platform?.iconUrl} alt={platform?.displayName ?? ""} /></p>
                            <p>You have chosen the <strong>{flavor?.displayName}</strong> reference architecture <span className={styles.flexInline}><Icon src={flavor?.iconUrl} alt={flavor?.displayName ?? ""} /> <Icon src={openshiftImg} alt="OpenShift" /></span></p>
                            <p>It will install with the following Storage Option <Icon src={storage?.iconUrl} alt={storage?.displayName ?? ""} /></p>
                        </div>

                        <div>
                            You have chosen the following IBM Software to help get your solution started:
                            <ul>
                                {software?.map(sw => (
                                    <li key={sw.name}>{sw.displayName ?? sw.name}</li>
                                ))}
                            </ul>
                        </div>
                        <p>
                            If you are happy with this selection of content for your solution click on the Submit button below. You can always change the
                            content later by adding an removing your own bill of materials.
                        </p>
                    </div>
                </Column>
            </Row>
        </FlexGrid>
    );
}
