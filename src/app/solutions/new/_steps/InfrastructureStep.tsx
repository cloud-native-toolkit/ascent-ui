"use client"

import {FlexGrid, Row, ProgressIndicator, ProgressStep, Column} from "@carbon/react";

import styles from '../page.module.scss';
import {InfraPlatformStep} from "@/app/solutions/new/_steps/_infra/InfraPlatformStep";
import {InfraFlavorStep} from "@/app/solutions/new/_steps/_infra/InfraFlavorStep";
import {InfraStorageStep} from "@/app/solutions/new/_steps/_infra/InfraStorageStep";
import {ProgressStepState} from "@/models";

interface InfrastructureStepProps {
    visible: boolean;
    currentState: ProgressStepState;
}

export const InfrastructureStep = ({visible, currentState}: InfrastructureStepProps) => {

    if (!visible) {
        return (<></>)
    }

    return (
        <FlexGrid className={styles.wizardGrid}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>
                        Step 2: Select your infrastructure
                    </h3>
                    <br />
                    <ProgressIndicator currentIndex={currentState.index}>
                        <ProgressStep label="Platform" />
                        <ProgressStep label="Architecture" />
                        <ProgressStep label="Storage" />
                    </ProgressIndicator>
                    <br />
                    <InfraPlatformStep visible={currentState.index === 0}/>
                    <InfraFlavorStep visible={currentState.index === 1}/>
                    <InfraStorageStep visible={currentState.index === 2}/>
                </Column>
            </Row>
        </FlexGrid>
    )
}