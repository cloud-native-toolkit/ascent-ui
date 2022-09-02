import React, { Component } from 'react';
import {
    Navigate
} from "react-router-dom";
import {
    Form, TextInput, TextArea, FormGroup, MultiSelect, ButtonSkeleton,
    FileUploader, Select, SelectItem, Grid, Row, Column, Button
} from 'carbon-components-react';

import { v4 as uuidv4 } from 'uuid';

import * as superagent from "superagent";

import {
    servicePlatforms
} from '../../../data/data';

class SolutionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onRequestClose: this.props.handleClose,
            solutionFiles: undefined,
            architectures: [],
            selectedArchs: [],
            fields: {
                id: uuidv4(),
                name: "",
                short_desc: "",
                long_desc: "",
                public: false,
                platform: "ocp4",
            },
            acceptedFiles: ['.md','.png','.jpg','.jpeg','.pdf','.sh','.template','.drawio','.tfvars','.gitignore']
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data));
            this.state = {
                fields: jsonObject,
                selectedArchs: jsonObject.architectures || [],
                acceptedFiles: ['.md','.png','.jpg','.jpeg','.pdf','.sh','.template','.drawio','.tfvars','.gitignore']
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadDiagrams = this.uploadDiagrams.bind(this);
    }

    async componentDidMount() {
        this.setState({
            architectures: [...(await (await fetch(`/api/users/${encodeURIComponent(this.props?.user?.email)}/architectures`)).json()),...(await (await fetch(`/api/architectures`)).json())].filter((value, index, self) => {
                return self.findIndex(elt => elt.arch_id === value.arch_id) === index;
            })
        });
    };

    handleChange(field, e) {
        let fields = this.state.fields;
        let overwrite = "";
        if (field === "overwrite") {
            overwrite = e.target.value;
        } else if (field === "public") {
            fields[field] = e.target.value === "true";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields, overwrite });
    }

    uploadDiagrams(solutionId) {
        // Upload Diagrams
        const files = this.state.solutionFiles;
        if (files) {
            this.props.toast("info", "Uploading Files", `Uploading files for solution ${solutionId}...`);
            for (const file of files) {
                if (file?.size > 2048000) return this.props.toast("error", "Too Large", `File ${file.name} too larde. Max size: 2MiB.`);
            }
            let data = new FormData();
            for (const file of files) {
                data.append(file.name, file);
            }
            return superagent
                .post(`/api/solutions/${solutionId}/files`)
                .send(data)
                .set('accept', 'application/json')
                .then(res => {
                    this.props.toast("success", "OK", `Upload successful for solution ${solutionId}!`);
                    this.props.handleClose();
                })
                .catch(err => {
                    console.log(err);
                    this.props.toast("error", "Upload Error", `Error uploading files for solution ${solutionId} (check the logs for more details).`);
                    this.props.handleClose();
                });
        } else {
            this.props.handleClose();
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.props.isDuplicate) {
            console.log("Not yet implemented.");
        } else if(this.state.fields.id && this.props.isUpdate) {
            // PATCH Solution
            delete this.state.fields?.architectures;
            const body = {
                solution: this.state.fields,
                architectures: this.state.selectedArchs,
                platform: this.state.platform
            };
            this.props.toast("info", "Updating", `Updating solution ${body.solution.id}...`);
            const res = await (await fetch(`/api/solutions/${body.solution.id}`, {method: 'PATCH', body: JSON.stringify(body), headers: {"Content-type": "application/json"}})).json();
            if (res?.error) {
                this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.error.message);
                return;
            }
            this.props.toast("success", "OK", `Solution ${body.solution.id} has been updated.`);
            this.uploadDiagrams(res.id);
        } else if (this.state.fields.id) {
            // POST new solution
            const body = {
                solution: this.state.fields,
                architectures: this.state.selectedArchs,
                platform: this.state.platform
            };
            this.props.toast("info", "Creating", `Creating solution ${body.solution.id}...`);
            const res = await (await fetch('/api/solutions', {method: 'POST', body: JSON.stringify(body), headers: {"Content-type": "application/json"}})).json();
            if (res?.error) {
                this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.error.message);
                return;
            }
            this.uploadDiagrams(res.id);
            this.setState({ navigate: `/solutions/${res.id}` });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a solution ID.");
        }
    }

    validInputs() {
        return this.state.fields?.id && 
        this.state.fields?.name && 
        this.state.fields?.short_desc;
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Column>
                        {this.state.navigate ? <Navigate to={this.state.navigate} /> : <></>}
                        <Form name="solutionform" onSubmit={this.handleSubmit.bind(this)}>
                            <TextInput
                                data-modal-primary-focus
                                id="name"
                                name="name"
                                required
                                invalidText="Please Enter The Value"
                                onChange={this.handleChange.bind(this, "name")}
                                value={this.state.fields.name}
                                labelText="Solution Name*"
                                placeholder="e.g. OpenShift"
                                style={{ marginBottom: '1rem' }}
                            />
                            {!this.props.isDuplicate && <TextInput
                                data-modal-primary-focus
                                id="short_desc"
                                name="short_desc"
                                required
                                invalidText="Please Enter The Value"
                                onChange={this.handleChange.bind(this, "short_desc")}
                                value={this.state.fields.short_desc}
                                labelText="Short Description*"
                                placeholder="e.g. FS Cloud single zone environment with OpenShift cluster and SRE tools."
                                style={{ marginBottom: '1rem' }}
                            />}
                            {!this.props.isDuplicate && <TextArea
                                required
                                // cols={50}
                                id="long_desc"
                                name="long_desc"
                                value={this.state.fields.long_desc}
                                onChange={this.handleChange.bind(this, "long_desc")}
                                invalidText="A valid value is required"
                                labelText="Long Description"
                                placeholder="Solution long description"
                                rows={2}
                                style={{ marginBottom: '1rem' }}
                            />}
                            {!this.props.isDuplicate && <Select id="platform" name="platform"
                                labelText="Platform*"
                                required
                                defaultValue={this.state.fields.platform}
                                invalidText="A valid value is required"
                                onChange={this.handleChange.bind(this, "platform")}
                                style={{ marginBottom: '1rem' }}>
                                {servicePlatforms.map(platform => (
                                    <SelectItem value={platform.val} text={platform.label} />
                                ))}
                            </Select>}
                            {!this.props.isDuplicate && this.props.user?.roles?.includes('admin') && <Select id="public" name="public"
                                labelText="Public*"
                                required
                                defaultValue={this.state.fields.public}
                                invalidText="A valid value is required"
                                onChange={this.handleChange.bind(this, "public")}
                                style={{ marginBottom: '1rem' }}>
                                <SelectItem value={false} text="False" />
                                <SelectItem value={true} text="True" />
                            </Select>}
                            {!this.props.isDuplicate && this.state.architectures ? <FormGroup legendText="BOMs*" style={{ marginBottom: '1rem' }} ><MultiSelect.Filterable
                                id='ref-archs'
                                items={this.state.architectures}
                                itemToString={(item) => {return `${item.name} (${item.arch_id})`}}
                                onChange={(event) => this.setState({selectedArchs: event.selectedItems})}
                                initialSelectedItems={this.state.selectedArchs}
                                placeholder='Bill(s) of materials'
                                size='sm'/> </FormGroup>: <ButtonSkeleton />}
                            {!this.props.isDuplicate && <FileUploader multiple
                                accept={this.state.acceptedFiles}
                                labelText={"Drag and drop files, or click to upload"}
                                labelTitle={"Attached Files"}
                                buttonLabel='Add file(s)'
                                labelDescription={`Max file size is 2MiB. Accepted files: ${this.state.acceptedFiles.join(' ')} `}
                                filenameStatus='edit'
                                onChange={(event) => this.setState({solutionFiles: event?.target?.files})}
                                onDelete={() => this.setState({solutionFiles: undefined})} />}
                        </Form>
                        <Button
                            className='form-button'
                            size='xl'
                            kind='secondary'
                            onClick={() => { this.props.handleClose() }}>
                            Cancel
                        </Button>
                        <Button
                            className='form-button'
                            size='xl'
                            disabled={!this.validInputs()}
                            onClick={this.handleSubmit}>
                            {this.props.primaryButtonText ? this.props.primaryButtonText : 'Create'}
                        </Button>
                    </Column>
                </Row>
            </Grid>
        );
    }
}
export default SolutionModal;
