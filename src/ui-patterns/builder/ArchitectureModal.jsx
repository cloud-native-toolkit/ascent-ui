import React, { Component } from 'react';
import {
    Form,
    ComposedModal,
    ModalBody,
    ModalHeader,
    ModalFooter, 
    FormGroup,
    TextInput,
    TextArea,
    Select,
    SelectItem,
    FileUploader
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

class ArchitectureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            diagramDrawio: false,
            diagramPng: false,
            fields: {
                arch_id: "",
                name: "",
                short_desc: "",
                long_desc: "",
                public: false,
                production_ready: false,
                automation_variables: ""
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"_id\":"));
            console.log(jsonObject);
            this.state = {
                fields: jsonObject
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    uploadDiagrams(arch_id) {
        // Upload Diagrams
        const drawio = this.state.diagramDrawio;
        const png = this.state.diagramPng;
        if (drawio || png) {
            this.props.toast("info", "Uploading Diagram", `Uploading diagrams for architecture ${arch_id}.`);
            console.log(drawio);
            console.log(png);
            if (!drawio?.name.endsWith(".drawio")) return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (png?.type !== "image/png") return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (drawio?.size > 409600) return this.props.toast("error", "Too Large", "Drawio file too larde, max size: 400KiB.");
            if (png?.size > 2048000) return this.props.toast("error", "Too Large", "PNG file too larde, max size: 2MiB.");
            let data = new FormData();
            if (drawio) data.append("drawio", drawio);
            if (png) data.append("png", png);
            this.props.architectureService.uploadDiagrams(this.state.fields.arch_id, data).then((res) => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Upload Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Diagrams upload successful!`);
                }
                this.props.handleClose();
            });
        } else {
            this.props.handleClose();
        }
    }


    handleChange(field, e) {
        let fields = this.state.fields;
        if (field === "automation_variables") {
            fields[field] = e;
        } else if (field === "public" || field === "production_ready") {
            fields[field] = e.target.value === "true";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.fields);
        if (this.state.fields.arch_id && !this.props.isUpdate) {
            this.props.architectureService.addArchitecture(this.state.fields).then(res => {
                console.log(res);
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Architecture ${res.arch_id} successfully added!`);
                    
                    this.uploadDiagrams(res.arch_id);
                }
            });
        } else if(this.state.fields.arch_id) {
            this.props.architectureService.updateArchitecture(this.props.data.arch_id, {
                automation_variables: this.state.fields.automation_variables
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Architecture ${res.arch_id} successfully updated!`);
                    this.uploadDiagrams(res.arch_id);
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set an architecture ID.");
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : "Add"} Architecture</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="architectureform" onSubmit={this.handleSubmit.bind(this)}>
                                <TextInput
                                    data-modal-primary-focus
                                    id="arch_id"
                                    name="arch_id"
                                    required
                                    disabled={this.props.isUpdate}
                                    hidden={this.props.isUpdate}
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "arch_id")}
                                    value={this.state.fields.arch_id}
                                    labelText={this.props.data ? "" : "Architecture ID"}
                                    placeholder="e.g. common-services"
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
                                    labelText="Architecture Name"
                                    placeholder="e.g. Common Services"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="short_desc"
                                    name="short_desc"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "short_desc")}
                                    value={this.state.fields.short_desc}
                                    labelText="Short Description"
                                    placeholder="e.g. Common Services"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextArea
                                    required
                                    // cols={50}
                                    id="long_desc"
                                    name="long_desc"
                                    value={this.state.fields.long_desc}
                                    onChange={this.handleChange.bind(this, "long_desc")}
                                    invalidText="A valid value is required"
                                    labelText="Long Description"
                                    placeholder="Architecture long description"
                                    rows={2}
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FileUploader 
                                    accept={['.drawio']}
                                    labelText={"Drag and drop a .drawio file, or click to upload"}
                                    labelTitle={"Diagram .drawio"}
                                    buttonLabel='Add file'
                                    labelDescription={"Max file size is 400KiB. Only .drawio files are supported."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({diagramDrawio: event?.target?.files[0]})}
                                    onDelete={() => this.setState({diagramDrawio: undefined})} />
                                <FileUploader 
                                    accept={['.png']}
                                    labelText={"Drag and drop a .png file, or click to upload"}
                                    labelTitle={"Diagram .png"}
                                    buttonLabel='Add file'
                                    labelDescription={"Max file size is 2MiB. Only .png files are supported."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({diagramPng: event?.target?.files[0]})}
                                    onDelete={() => this.setState({diagramPng: undefined})} />
                                <Select id="public" name="public"
                                    labelText="Public"
                                    required
                                    defaultValue={this.state.fields.public}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "public")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>
                                <Select id="production_ready" name="production_ready"
                                    labelText="Production Ready"
                                    required
                                    defaultValue={!this.state.fields.production_ready ? false : this.state.fields.production_ready}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "production_ready")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>
                                <FormGroup legendText="Automation Variables">
                                    <AceEditor
                                        focus
                                        style={{ width: "100%" }}
                                        mode="yaml"
                                        // theme="github"
                                        height="200px"
                                        id="automation_variables"
                                        name="automation_variables"
                                        placeholder="alias: example"
                                        value={this.state.fields.automation_variables}
                                        onChange={this.handleChange.bind(this, "automation_variables")}
                                        labelText="Automation Variables"
                                        ref="editorInput"
                                        // fontSize={20}
                                        showPrintMargin
                                        showGutter={true}
                                        highlightActiveLine
                                        setOptions={{
                                            enableBasicAutocompletion: false,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 2
                                        }}
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : "Add"} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }
}
export default ArchitectureModal;