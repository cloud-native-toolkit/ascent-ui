"use client"

import {useState} from "react";
import {Button, Column, FlexGrid, Form, Row, SelectItem} from "@carbon/react";
import {v4 as uuidv4} from 'uuid';
import {useAtom} from "jotai";
import {useRouter} from "next/navigation";

import {FileUploader, FilterableMultiSelect, FormGroup, Select, TextArea, TextInput} from '../Form';
import { architecturesAtom } from "@/atoms";
import {servicePlatforms} from '@/data';
import {AddNotification, Architectures, BaseSolution, Solution, User} from "@/models";
import {CompositeSolution, solutionsApi} from "@/services";

interface SolutionModalProps {
    show: boolean;
    handleClose: () => void;
    isUpdate: boolean;
    isDuplicate: boolean;
    toast: AddNotification;
    data: boolean;
    primaryButtonText?: string;
    user?: User;
}

const defaultModalData = (): BaseSolution => {
    return {
        id: uuidv4(),
        name: '',
        short_desc: '',
        long_desc: '',
        public: false,
        platform: 'ocp4',
        architectures: []
    }
}

// TODO this should come from configuration
const acceptedFiles: string[] = ['.md','.png','.jpg','.jpeg','.pdf','.sh','.template','.drawio','.tfvars','.gitignore']

export const SolutionModal = ({handleClose, isUpdate, isDuplicate, toast, user, primaryButtonText}: SolutionModalProps) => {
    const [{data: architectures}] = useAtom(architecturesAtom);
    const [modalData, setModalData] = useState<BaseSolution>(defaultModalData());
    const [selectedArchitectures, setSelectedArchitectures] = useState<Architectures[]>([]);
    const [solutionFiles, setSolutionFiles] = useState<FileList | undefined>();
    const router = useRouter();

    const getValue = (name: string) => {
        return (): string => {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            return (modalData as any)[name] || '';
        }
    }
    const setValue = (name: string) => {
        return (value: string) => {
            setModalData({...modalData, [name]: value})
        }
    }

    const validInputs = () => {
        return modalData?.id &&
            modalData?.name &&
            modalData?.short_desc;
    }

    const uploadDiagrams = async (solutionId: string) => {
        const files = solutionFiles;
        if (files) {
            toast("info", "Uploading Files", `Uploading files for solution ${solutionId}...`);

            const data: Array<{name: string, file: File}> = []
            for (const file of files) {
                if (file?.size > 2048000) return toast("error", "Too Large", `File ${file.name} too large. Max size: 2MiB.`);
                data.push({name: file.name, file});
            }

            try {
                await solutionsApi().uploadDiagrams(solutionId, data);

                toast("success", "OK", `Upload successful for solution ${solutionId}!`);
            } catch (err) {
                console.log(err);
                toast("error", "Upload Error", `Error uploading files for solution ${solutionId} (check the logs for more details).`);
            }
        }

        handleClose();
    }

    const handleSubmit = async () => {
        if (isDuplicate) {
            console.log("Not yet implemented.");
        } else if(modalData.id && isUpdate) {
            delete modalData?.architectures;

            const body: CompositeSolution = {
                solution: modalData,
                architectures: selectedArchitectures,
                platform: modalData.platform || '',
                solutions: [],
            };

            toast("info", "Updating", `Updating solution ${body.solution.id}...`);

            try {
                await solutionsApi().updateComposite(modalData.id, body)

                toast("success", "OK", `Solution ${body.solution.id} has been updated.`);

                await uploadDiagrams(modalData.id);
            } catch (error) {
                toast("error", "Error updating solution", (error as Error).message);
            }
        } else if (modalData.id) {
            // POST new solution
            const body: CompositeSolution = {
                solution: modalData,
                architectures: selectedArchitectures,
                platform: modalData.platform || '',
                solutions: [],
            };

            toast("info", "Creating", `Creating solution ${body.solution.id}...`);

            try {
                const result: Solution = await solutionsApi().addComposite(body);

                await uploadDiagrams(modalData.id);

                router.push(`/solutions/${result.id}`);
            } catch (error) {
                toast("error", "Error creating solution", (error as Error).message);
            }
        } else {
            toast("error", "INVALID INPUT", "You must set a solution ID.");
        }
    }

    return (
        <FlexGrid>
            <Row>
                <Column>
                    <Form name="solutionform" onSubmit={() => handleSubmit()}>
                        <TextInput
                            data-modal-primary-focus
                            id="name"
                            name="name"
                            required
                            invalidText="Please Enter The Value"
                            setValue={setValue("name")}
                            getValue={getValue("name")}
                            labelText="Solution Name*"
                            placeholder="e.g. OpenShift"
                            style={{ marginBottom: '1rem' }}
                        />
                        <TextInput
                          data-modal-primary-focus
                          id="short_desc"
                          name="short_desc"
                          hide={isDuplicate}
                          required
                          invalidText="Please Enter The Value"
                          setValue={setValue("short_desc")}
                          getValue={getValue("short_desc")}
                          labelText="Short Description*"
                          placeholder="e.g. FS Cloud single zone environment with OpenShift cluster and SRE tools."
                          style={{ marginBottom: '1rem' }}
                        />
                        <TextArea
                          required
                          id="long_desc"
                          name="long_desc"
                          hide={isDuplicate}
                          setValue={setValue("long_desc")}
                          getValue={getValue("long_desc")}
                          invalidText="A valid value is required"
                          labelText="Long Description"
                          placeholder="Solution long description"
                          rows={2}
                          style={{ marginBottom: '1rem' }}
                        />
                        <Select id="platform"
                                name="platform"
                                labelText="Platform*"
                                hide={isDuplicate}
                                required
                                getValue={getValue("platform")}
                                setValue={setValue("platform")}
                                invalidText="A valid value is required"
                                style={{ marginBottom: '1rem' }}>
                            {servicePlatforms.map(platform => {
                                return (<SelectItem key={platform.val} value={platform.val} text={platform.label}/>)
                            })}
                        </Select>
                        <Select id="public"
                                name="public"
                                labelText="Public*"
                                hide={isDuplicate || !user?.roles?.includes('admin')}
                                required
                                getValue={getValue("public")}
                                setValue={setValue("public")}
                                invalidText="A valid value is required"
                                style={{ marginBottom: '1rem' }}>
                          <SelectItem value={false} text="False" />
                          <SelectItem value={true} text="True" />
                        </Select>
                        <Select id="techzone"
                                name="techzone"
                                labelText="Deploy to TechZone"
                                hide={isDuplicate && !user?.roles?.includes('admin')}
                                required
                                invalidText="A valid value is required"
                                getValue={getValue("techzone")}
                                setValue={setValue("techzone")}
                                style={{ marginBottom: '1rem' }}>
                          <SelectItem value={false} text="False" />
                          <SelectItem value={true} text="True" />
                        </Select>
                        <FormGroup hide={isDuplicate || !architectures} legendText="BOMs*" style={{ marginBottom: '1rem' }} >
                            <FilterableMultiSelect
                                id='ref-archs'
                                items={architectures}
                                itemToString={(item: Architectures) => {return `${item.name} (${item.arch_id})`}}
                                setValue={setSelectedArchitectures}
                                getValue={() => selectedArchitectures}
                                placeholder='Bill(s) of materials'
                                size='sm'
                                filterItems={(items, {inputValue, itemToString}) => {
                                    return items.filter(item => itemToString(item).toLowerCase().includes((inputValue || '').toLowerCase()))
                                }}
                            />
                        </FormGroup>
                        <FileUploader multiple
                                      accept={acceptedFiles}
                                      labelTitle={"Attached Files"}
                                      buttonLabel='Add file(s)'
                                      labelDescription={`Max file size is 2MiB. Accepted files: ${acceptedFiles.join(' ')} `}
                                      filenameStatus='edit'
                                      setValue={setSolutionFiles}
                        />
                    </Form>
                    <Button
                        className='form-button'
                        size='xl'
                        kind='secondary'
                        onClick={() => handleClose()}>
                        Cancel
                    </Button>
                    <Button
                        className='form-button'
                        size='xl'
                        disabled={!validInputs()}
                        onClick={() => handleSubmit()}>
                        {primaryButtonText ? primaryButtonText : 'Create'}
                    </Button>
                </Column>
            </Row>
        </FlexGrid>
    );
}
