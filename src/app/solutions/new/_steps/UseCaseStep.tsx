"use client"

import {useAtom, useAtomValue} from "jotai";
import {Column, FlexGrid, Row} from "@carbon/react";

import {personaAtom, useCasesAtom} from "@/atoms";
import {Icon} from "@/components";
import {UseCaseMetadata} from "@/models";

import styles from "../page.module.scss";

interface UseCaseStepProps {
    visible: boolean;
}

export const UseCaseStep = ({visible}: UseCaseStepProps) => {
    const {data: useCases} = useAtomValue(useCasesAtom);
    const [persona, setPersona] = useAtom(personaAtom);

    if (!visible) {
        return (<></>)
    }

    return (
        <FlexGrid className={styles.wizardGrid}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>Step 1: What are you trying to achieve ?</h3>
                    <div className={styles.selectionSet}>
                        <form className={styles.plan}>
                            <div className={styles.title}>To help guide your solution creation, the first
                                step is to select the use case you are trying to support.
                                this will help the solution wizard to guide you to the best outcome
                                for your automation
                            </div>
                            {
                                useCases?.length ?
                                    useCases.map((useCase: UseCaseMetadata) => (
                                        <label className={`${styles.plan} ${styles.completePlan}`} htmlFor={useCase.name} key={useCase.name}>
                                            <input type="radio" checked={!!(persona?.name && persona?.name === useCase.name)} name={useCase.name} id={useCase.name} onClick={() => setPersona(useCase)} />
                                            <div className={styles.planContent}>
                                                <Icon src={useCase.iconUrl} alt="" />
                                                <div className={styles.planDetails}>
                                                    <span>{useCase.displayName ?? useCase.name}</span>
                                                    <p>{useCase.description}</p>
                                                </div>
                                            </div>
                                        </label>
                                    )) : <p>No Personas</p>
                            }
                        </form>
                    </div>
                </Column>
            </Row>
        </FlexGrid>
    )
}