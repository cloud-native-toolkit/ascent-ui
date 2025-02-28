"use client"

import {useAtomValue, useSetAtom} from "jotai";
import {Column, FlexGrid, Row} from "@carbon/react";
import {ContainerSoftware} from "@carbon/icons-react";

import {softwareAtom, softwareOptionsAtom} from "@/atoms";
import {CatalogContent, StatefulTileCatalog} from "@/components";
import {Bom} from "@/models";

interface SoftwareStepProps {
    visible: boolean;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const tileRenderFunction = ({values}: {values: any}) => <CatalogContent {...values} icon={<ContainerSoftware />} />;

export const SoftwareStep = ({visible}: SoftwareStepProps) => {
    const {data: softwareOptions} = useAtomValue(softwareOptionsAtom);
    const setSoftware = useSetAtom(softwareAtom);

    if (!visible) return (<></>);

    return (
        <FlexGrid className='wizard-grid'>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>Step 3: Select your Software</h3>
                    <div className="title">
                        We are getting close to create your custom solution for your client or partner, we need a few more details like the solution name and description.
                        Dont worry you can edit you solution once its created to refine it so you client or partner is completely happy.
                    </div>
                    <br />
                    <StatefulTileCatalog
                        title='Software Bundles'
                        id='software-bundles'
                        isMultiSelect
                        tiles= {
                            softwareOptions.map((software: Bom) => ({
                                id: software.name,
                                value: {
                                    title: software.name,
                                    logo: software.iconUrl,
                                    displayName: software.displayName ?? software.name,
                                    description: software.description,
                                },
                                renderContent: tileRenderFunction,
                            }))
                        }
                        pagination={{ pageSize: 9 }}
                        isSelectedByDefault={false}
                        onSelection={(selection: string[]) => {
                            setSoftware(softwareOptions.filter(software => selection.includes(software.name)))
                        }}
                    />
                    <br />
                </Column>
            </Row>
        </FlexGrid>
    );
}
