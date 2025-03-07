"use client"

import {Column, FlexGrid, Form, Row, SelectItem} from "@carbon/react";
import {useAtom} from "jotai";

import {newSolutionAtom} from "@/atoms";
import {Select, TextArea, TextInput} from "@/components/Form";
import {User} from "@/models";

interface DetailsStepProps {
    visible: boolean;
    isDuplicate?: boolean;
    user?: User;
}

import styles from '../page.module.scss';

export const DetailsStep = ({visible, isDuplicate, user}: DetailsStepProps) => {
    const [newSolution, setNewSolution] = useAtom(newSolutionAtom);

    const getValue = (name: string) => {
        return (): string => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            return (newSolution as any)[name];
        }
    }
    const setValue = (name: string) => {
        return (value: string) => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            setNewSolution({...newSolution, [name]: value} as any)
        }
    }

    if (!visible) return (<></>);

    return (
        <FlexGrid className={styles.wizardGrid}>
            <Row>
                <Column lg={{ span: 12 }}>
                    <h3>Step 4: What do you want to call your solution?</h3>
                    <div className={styles.title}>
                        We need a few more details before we can create your solution. We need the solution name
                        and description so we can identify it later
                    </div>

                    <Form name="solutionform">
                        <TextInput
                            data-modal-primary-focus
                            id="id"
                            name="id"
                            required
                            invalidText="Please Enter The Value"
                            getValue={getValue("id")}
                            setValue={setValue("id")}
                            labelText="Solution ID"
                            placeholder="e.g. fs-cloud-szr-ocp"
                            style={{ marginBottom: '1rem' }}
                        />
                        <TextInput
                            data-modal-primary-focus
                            id="name"
                            name="name"
                            required
                            invalidText="Please Enter The Value"
                            getValue={getValue("name")}
                            setValue={setValue("name")}
                            labelText="Solution Name"
                            placeholder="e.g. OpenShift"
                            style={{ marginBottom: '1rem' }}
                        />
                        <TextInput
                          data-modal-primary-focus
                          id="short_desc"
                          name="short_desc"
                          hide={!!isDuplicate}
                          required
                          invalidText="Please Enter The Value"
                          getValue={getValue("short_desc")}
                          setValue={setValue("short_desc")}
                          labelText="Short Description"
                          placeholder="e.g. FS Cloud single zone environment with OpenShift cluster and SRE tools."
                          style={{ marginBottom: '1rem' }}
                        />
                        <TextArea
                          required
                            // cols={50}
                          id="long_desc"
                          name="long_desc"
                          hide={!!isDuplicate}
                          getValue={getValue("long_desc")}
                          setValue={setValue("long_desc")}
                          invalidText="A valid value is required"
                          labelText="Long Description"
                          placeholder="Solution long description"
                          rows={2}
                          style={{ marginBottom: '1rem' }}
                        />
                        <Select id="public" name="public"
                                labelText="Public"
                                required
                                hide={!!isDuplicate || !user?.roles?.includes('admin')}
                                invalidText="A valid value is required"
                                getValue={getValue("public")}
                                setValue={setValue("public")}
                                style={{ marginBottom: '1rem' }}>
                          <SelectItem value={false} text="False" />
                          <SelectItem value={true} text="True" />
                        </Select>
                        <Select id="techzone"
                                name="techzone"
                                labelText="Deploy to TechZone"
                                required
                                invalidText="A valid value is required"
                                hide={!!isDuplicate || !user?.roles?.includes('admin')}
                                getValue={getValue("techzone")}
                                setValue={setValue("techzone")}
                                style={{ marginBottom: '1rem' }}>
                          <SelectItem value={false} text="False" />
                          <SelectItem value={true} text="True" />
                        </Select>
                    </Form>
                </Column>
            </Row>
        </FlexGrid>
    );
}
