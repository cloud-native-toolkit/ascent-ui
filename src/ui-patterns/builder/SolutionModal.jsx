import React, { Component } from 'react';
import {
    Form,
    ComposedModal,
    ModalBody,
    ModalHeader,
    ModalFooter, 
    TextInput,
    TextArea,
    FormGroup,
    MultiSelect,
    ButtonSkeleton,
    FileUploader,
    Select,
    SelectItem
} from 'carbon-components-react';

import {Redirect} from 'react-router-dom';

import * as superagent from "superagent";

import AceEditor from "react-ace";
import "brace/mode/yaml"; 

class SolutionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            solutionFiles: undefined,
            architectures: [],
            selectedArchs: [],
            fields: {
                id: "",
                name: "",
                short_desc: "",
                long_desc: "",
                public: false
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data));
            this.state = {
                fields: jsonObject,
                selectedArchs: jsonObject.architectures || []
            }
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadDiagrams = this.uploadDiagrams.bind(this);
    }

    async componentDidMount() {
        this.setState({
            architectures: [...(await (await fetch(`/api/users/${this.props?.user?.email}/architectures`)).json()),...(await (await fetch(`/api/architectures`)).json())]
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
                architectures: this.state.selectedArchs
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
                architectures: this.state.selectedArchs
            };
            this.props.toast("info", "Creating", `Creating solution ${body.solution.id}...`);
            const res = await (await fetch('/api/solutions', {method: 'POST', body: JSON.stringify(body), headers: {"Content-type": "application/json"}})).json();
            if (res?.error) {
                this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.error.message);
                return;
            }
            this.uploadDiagrams(res.id);
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a solution ID.");
        }
    }

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <ComposedModal
                        open={this.props.show}
                        onClose={this.props.handleClose}>
                        <ModalHeader >
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : this.props.isDuplicate ? "Duplicate" : "Add"} Solution</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>

                            <Form name="solutionform" onSubmit={this.handleSubmit.bind(this)}>
                                <TextInput
                                    data-modal-primary-focus
                                    id="id"
                                    name="id"
                                    required
                                    disabled={this.props.isUpdate}
                                    hidden={this.props.isUpdate}
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "id")}
                                    value={this.state.fields.id}
                                    labelText={this.props.data ? "" : "Solution ID"}
                                    placeholder="e.g. fs-cloud-szr-ocp"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="name"
                                    name="name"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "name")}
                                    value={this.state.fields.name}
                                    labelText="Solution Name"
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
                                    labelText="Short Description"
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
                                {!this.props.isDuplicate && <Select id="public" name="public"
                                    labelText="Public"
                                    required
                                    defaultValue={this.state.fields.public}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "public")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>}
                                {!this.props.isDuplicate && this.state.architectures ? <FormGroup legendText="Architectures" style={{ marginBottom: '1rem' }} ><MultiSelect.Filterable
                                    id='ref-archs'
                                    items={this.state.architectures}
                                    itemToString={(item) => {return item.name}}
                                    onChange={(event) => this.setState({selectedArchs: event.selectedItems})}
                                    initialSelectedItems={this.state.selectedArchs}
                                    placeholder='Control Families'
                                    size='sm'/> </FormGroup>: <ButtonSkeleton />}
                                {!this.props.isDuplicate && <FileUploader multiple
                                    accept={['.md','.png','.jpg','.jpeg','.pdf','.sh','.template','.drawio','.tfvars']}
                                    labelText={"Drag and drop files, or click to upload"}
                                    labelTitle={"Attached Files"}
                                    buttonLabel='Add file(s)'
                                    labelDescription={"Max file size is 2MiB."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({solutionFiles: event?.target?.files})}
                                    onDelete={() => this.setState({solutionFiles: undefined})} />}
                            </Form>
                            
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : this.props.isDuplicate ? "Duplicate" : "Add"} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }
}
export default SolutionModal;