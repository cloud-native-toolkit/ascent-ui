"use client"

import {Column, FlexGrid, Row} from "@carbon/react";

import StacksImg from '../../../../images/stacks.png';

import styles from '../page.module.scss';
import {Icon} from "@/components";

interface OverviewStepProps {
    visible: boolean;
}

export const OverviewStep = ({visible}: OverviewStepProps) => {
    if (!visible) {
        return (<></>)
    }

    return (
        <FlexGrid className={styles.wizardGrid}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>Welcome to the Solution Wizard</h3>
                    <br />
                </Column>
            </Row>
            <Row>
                <Column lg={{ span: 6 }} md={{ span: 12 }}>
                    <div className={styles.overviewText}>
                        <p>
                            You are about to create a composite solution using the co-creation wizard.
                        </p>
                        <br />
                        <p>
                            To do that, you will have to specify if you want to create a solution for Demos, building an MVP, a Production environment or support development.
                            You will then select the platform on which you wish to deploy your solution (Azure, AWS, IBM Cloud or bring your own OpenShift),
                            the architecture pattern you which to deploy depending on your use case and the cluster storage you want to use.
                        </p>
                        <br />
                        <p>
                            Then, you will have to pick the IBM Software cartridges you need as part of your solution, from individual components of IBM Cloud Paks,
                            Sustainability Software, or bringing your own custom Software tiles. Once you have completed all these steps you will be redirected to
                            your new solution and can download the automation to support the provisioning into your own environment.
                        </p>
                    </div>
                </Column>
                <Column lg={{ span: 6 }} md={{ span: 12 }}>
                    <div className={styles.overviewImage}>
                        <Icon loading="lazy" src={StacksImg} alt="Diagram representing a solution stack" />
                    </div>
                </Column>
            </Row>
        </FlexGrid>
    );
}
