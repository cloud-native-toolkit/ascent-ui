"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAtomValue, useSetAtom} from "jotai";

import {Button, Column, FlexGrid, ProgressIndicator, ProgressStep, Row} from "@carbon/react";
import {Close} from "@carbon/icons-react";

import {DetailsStep} from "./_steps/DetailsStep";
import {OverviewStep} from "./_steps/OverviewStep";
import {SoftwareStep} from "./_steps/SoftwareStep";

import {InfrastructureStep} from "@/app/solutions/new/_steps/InfrastructureStep";
import {SummaryStep} from "@/app/solutions/new/_steps/SummaryStep";
import {UseCaseStep} from "@/app/solutions/new/_steps/UseCaseStep";

import {
    automationCatalogAtom,
    flavorAtom,
    newSolutionAtom,
    notificationsAtom,
    personaAtom,
    platformAtom,
    softwareAtom,
    storageAtom
} from "@/atoms";
import {BaseSolution, Bom, buildSteps, CloudProviderMetadata, FlavorMetadata, UseCaseMetadata} from "@/models";
import {solutionsApi} from "@/services";
import {unique} from "@/util";

import styles from './page.module.scss';

export default function NewSolutionPage() {
    const [currentStep, setCurrentStep] = useState(buildSteps(['Overview', {label: 'Use Case', isValid: ({persona}: {persona?: UseCaseMetadata}) => !!persona}, 'Infrastructure', {label: 'Software', isValid: ({software}: {software: Bom[]}) => software.length > 0}, {label: 'Solution Details', isValid: ({solution}: {solution?: BaseSolution}) => !!solution?.name}, 'Summary']));
    const [infrastructureStep, setInfrastructureStep] = useState(buildSteps([{label: 'Platform', isValid: ({platform}: {platform?: CloudProviderMetadata}) => !!platform}, {label: 'Architecture', isValid: ({flavor}: {flavor?: FlavorMetadata}) => !!flavor}, {label: 'Storage', isValid: ({storage}: {storage?: Bom}) => !!storage}]));

    const persona: UseCaseMetadata | undefined = useAtomValue(personaAtom);
    const platform: CloudProviderMetadata | undefined = useAtomValue(platformAtom);
    const flavor: FlavorMetadata | undefined = useAtomValue(flavorAtom);
    const storage: Bom | undefined = useAtomValue(storageAtom);
    const software: Bom[] = useAtomValue(softwareAtom);
    const solution: BaseSolution | undefined = useAtomValue(newSolutionAtom);
    // TODO handle pending data
    const {data: catalog} = useAtomValue(automationCatalogAtom);
    const addNotification = useSetAtom(notificationsAtom);

    const router = useRouter();

    const handleSubmit = () => {

        if (!solution) {
            console.log('Solution not defined')
            return;
        }

        /* eslint-disable @typescript-eslint/no-explicit-any */
        const tempLayers: Bom[] = (catalog?.boms?.filter(bom => bom.category === 'infrastructure' && bom.cloudProvider === platform?.name && (bom as any).flavor === flavor?.name) || []);
        // Get storage layer(s)
        if (storage) tempLayers.push(...(catalog?.boms?.filter((bom: Bom) => bom.name === storage?.name) || []));
        // Get software layers
        /* eslint-disable @typescript-eslint/no-explicit-any */
        for (const sw of software) tempLayers.push(catalog?.boms?.find(bom => bom.name === sw.name) as any);

        const layers = tempLayers
            .filter(layer => !!layer)
            .reduce(unique('name'), [])

        // Create solution
        const body = {
            solution,
            architectures: Array.from(layers).filter(layer => layer.type === 'bom').map(bom => ({ arch_id: bom.name })),
            solutions: Array.from(layers).filter(layer => layer.type === 'solution').map(sol => sol.name),
            platform: platform?.name || ''
        };

        console.log(body);
        addNotification({severity: "info", message: "Creating", detail: `Creating solution ${body.solution.id}...`});

        solutionsApi().addComposite(body)
            .then(solution => {
                addNotification({severity: "success", message: "Created", detail: `Solution ${solution.id} created successfully`});
                router.push(`/solutions/${solution.id}`);
            })
            .catch(error => {
                addNotification({severity: "error", message: "Error", detail: `Error creating solution: ${error.message}`});
            });
    }

    const handleNext = () => {
        if (!currentStep.hasNext()) {
            handleSubmit();
        } else if (currentStep.label === 'Infrastructure' && infrastructureStep.hasNext()) {
            setInfrastructureStep(infrastructureStep.next());
        } else {
            setCurrentStep(currentStep.next());
        }
    }

    const handleBack = () => {
        if (!currentStep.hasPrevious()) {
            return
        } else if (currentStep.label === 'Infrastructure' && infrastructureStep.hasPrevious()) {
            setInfrastructureStep(infrastructureStep.previous());
        } else {
            setCurrentStep(currentStep.previous());
        }
    }

    const nextDisabled = (): boolean => {
        const step = (currentStep.label === 'Infrastructure') ? infrastructureStep : currentStep;

        return !step.isValid({persona, platform, flavor, storage, software, solution});
    }

    return (
        <FlexGrid className={styles.createSolution}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h2>
                        Create Solution
                        <Button
                            kind='secondary'
                            renderIcon={Close}
                            onClick={() => router.push('/solutions/user')}>
                            Cancel
                        </Button>
                    </h2>
                    <br></br>
                </Column>
            </Row>

            <Row className={styles.modalWizard}>
                <Column lg={{ span: 2 }}>
                    <ProgressIndicator vertical currentIndex={currentStep?.index || 0}>
                        <ProgressStep label="Overview" />
                        <ProgressStep label="Use Case" />
                        <ProgressStep label="Infrastructure" />
                        <ProgressStep label="Software" />
                        <ProgressStep label="Solution Details" />
                        <ProgressStep label="Summary" />
                    </ProgressIndicator>
                </Column>
                <Column lg={{ span: 10 }}>
                    <OverviewStep visible={currentStep?.index === 0} />
                    <UseCaseStep visible={currentStep?.index === 1} />
                    <InfrastructureStep visible={currentStep?.index === 2} currentState={infrastructureStep} />
                    <SoftwareStep visible={currentStep?.index === 3} />
                    <DetailsStep visible={currentStep?.index === 4} />
                    <SummaryStep visible={currentStep?.index === 5} />

                    <br />

                    <Button kind='secondary'
                            style={{ marginRight: '1rem', display: currentStep.hasPrevious() ? 'unset' : 'none' }}
                            onClick={() => handleBack()}>Back</Button>
                    <Button onClick={() => handleNext()}
                            disabled={nextDisabled()}>{currentStep.hasNext() ? 'Next' : 'Submit'}</Button>
                </Column>
            </Row>
        </FlexGrid>
    );
}
