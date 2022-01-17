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

import {
    servicePlatforms
} from '../data/data';

class ArchitectureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            diagramDrawio: undefined,
            diagramPng: undefined,
            bomYaml: undefined,
            overwrite: "",
            fields: {
                arch_id: "",
                name: "",
                short_desc: "",
                long_desc: "",
                public: false,
                production_ready: false,
                automation_variables: "",
                platform: "",
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/"id":/g, "\"_id\":"));
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
            if (drawio && !drawio?.name.endsWith(".drawio")) return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (png && png?.type !== "image/png") return this.props.toast("error", "Wrong File Type", "Only .drawio is accepted.");
            if (drawio && drawio?.size > 2048000) return this.props.toast("error", "Too Large", "Drawio file too larde, max size: 2MiB.");
            if (png && png?.size > 2048000) return this.props.toast("error", "Too Large", "PNG file too larde, max size: 2MiB.");
            let data = new FormData();
            if (drawio) data.append("drawio", drawio);
            if (png) data.append("png", png);
            this.props.architectureService.uploadDiagrams(arch_id, data).then((res) => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Upload Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Diagrams upload successful!`);
                    this.props.handleReload();
                }
                this.props.handleClose(true);
            });
        } else {
            this.props.handleClose();
        }
    }


    handleChange(field, e) {
        let fields = this.state.fields;
        let overwrite = "";
        if (field === "overwrite") {
            overwrite = e.target.value
        } else if (field === "automation_variables") {
            fields[field] = e;
        } else if (field === "public" || field === "production_ready") {
            fields[field] = e.target.value === "true";
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields, overwrite });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.props.isImport) {
            // Upload Diagrams
            const bom = this.state.bomYaml;
            if (bom) {
                this.props.toast("info", "Uploading BOM", `Uploading BOM yaml.`);
                if (bom?.type !== "application/x-yaml" && bom?.type !== "text/yaml") return this.props.toast("error", "Wrong File Type", "Only .yaml is accepted.");
                if (bom?.size > 409600) return this.props.toast("error", "Too Large", "YAML file too larde, max size: 400KiB.");
                if (!this.state.fields.arch_id) return this.props.toast("error", "Missing values", "Please set an architecture ID.");
                let data = new FormData();
                data.append("bom", bom);
                this.props.architectureService.importBomYaml(this.state.fields.arch_id, data, this.state.overwrite === "overwrite").then(res => {
                    console.log(res);
                    if (res && res.body && res.body.error) {
                        this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                    } else {
                        this.props.toast("success", "Success", `BOM successfully imported!`);
                        
                        if (res?.architectures?.length) {
                            console.log(res?.architectures[0]?.arch_id);
                            this.uploadDiagrams(res?.architectures[0]?.arch_id);
                        }
                    }
                });
            } else {
                this.props.toast("error", "File Missing", "You must upload the BOM yaml file.");
            }
        } else if (this.props.isDuplicate) {
            this.props.toast("info", "Duplicating", `Duplicating architecture ${this.props.isDuplicate}...`);
            this.props.architectureService.duplicateArchitecture(this.props.isDuplicate, {
                arch_id: this.state.fields.arch_id,
                name: this.state.fields.name
            })
            .then((res) => {
                if (res?.body?.error) this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res?.body?.error?.message);
                else {
                    this.props.toast("success", "Success", `Bill of Materials ${this.props.isDuplicate} duplicated!`);
                    this.props.handleClose();
                    this.props.handleReload();
                }
            })
            .catch((err) => {
                this.addNotification("error", "Error", err);
            })
        } else if (this.state.fields.arch_id && !this.props.isUpdate) {
            this.props.architectureService.addArchitecture(this.state.fields).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Bill of Materials ${res.arch_id} successfully added!`);
                    
                    this.uploadDiagrams(res.arch_id);
                }
            });
        } else if(this.state.fields.arch_id) {
            console.log(this.state.fields);
            this.props.architectureService.updateArchitecture(this.props.data.arch_id, {
                name: this.state.fields.name,
                short_desc: this.state.fields.short_desc,
                long_desc: this.state.fields.long_desc,
                public: this.state.fields.public,
                platform: this.state.fields.platform,
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", res?.status === 401 ? "Unauthorized" : "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Bill of Materials ${res.arch_id} successfully updated!`);
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : this.props.isDuplicate ? "Duplicate" : "Add"} Bill of Materials</h3>
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
                                    labelText={this.props.data ? "" : "ID"}
                                    placeholder="e.g. common-services"
                                    style={{ marginBottom: '1rem' }}
                                />
                                {!this.props.isImport && <TextInput
                                    data-modal-primary-focus
                                    id="name"
                                    name="name"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "name")}
                                    value={this.state.fields.name}
                                    labelText="Bill of Materials Name"
                                    placeholder="e.g. Common Services"
                                    style={{ marginBottom: '1rem' }}
                                />}
                                {!this.props.isImport && !this.props.isDuplicate && <TextInput
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
                                />}
                                {!this.props.isImport && !this.props.isDuplicate && <TextArea
                                    required
                                    // cols={50}
                                    id="long_desc"
                                    name="long_desc"
                                    value={this.state.fields.long_desc}
                                    onChange={this.handleChange.bind(this, "long_desc")}
                                    invalidText="A valid value is required"
                                    labelText="Long Description"
                                    placeholder="Long description"
                                    rows={2}
                                    style={{ marginBottom: '1rem' }}
                                />}
                                {this.props.isImport && <FileUploader 
                                    accept={['.yaml']}
                                    labelText={"Drag and drop a .yaml file, or click to upload"}
                                    labelTitle={"BOM Yaml"}
                                    buttonLabel='Add file'
                                    labelDescription={"Max file size is 400KiB. Only .yaml files are supported."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({bomYaml: event?.target?.files[0]})}
                                    onDelete={() => this.setState({bomYaml: undefined})} />}
                                {this.props.isImport && <><strong>Overwrite</strong><TextInput
                                    data-modal-primary-focus
                                    id="overwrite"
                                    name="overwrite"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "overwrite")}
                                    value={this.state.overwrite}
                                    labelText='Type "overwrite" to overwrite the existing BOM components if architecture already exists.'
                                    placeholder="overwrite"
                                    style={{ marginBottom: '1rem' }}
                                /></>}
                                {!this.props.isDuplicate && <FileUploader 
                                    accept={['.drawio']}
                                    labelText={"Drag and drop a .drawio file, or click to upload"}
                                    labelTitle={"Diagram .drawio"}
                                    buttonLabel='Add file'
                                    labelDescription={"Max file size is 2MiB. Only .drawio files are supported."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({diagramDrawio: event?.target?.files[0]})}
                                    onDelete={() => this.setState({diagramDrawio: undefined})} />}
                                {!this.props.isDuplicate && <FileUploader 
                                    accept={['.png']}
                                    labelText={"Drag and drop a .png file, or click to upload"}
                                    labelTitle={"Diagram .png"}
                                    buttonLabel='Add file'
                                    labelDescription={"Max file size is 2MiB. Only .png files are supported."}
                                    filenameStatus='edit'
                                    onChange={(event) => this.setState({diagramPng: event?.target?.files[0]})}
                                    onDelete={() => this.setState({diagramPng: undefined})} />}
                                {!this.props.isImport && !this.props.isDuplicate && <Select id="platform" name="platform"
                                    labelText="Platform"
                                    required
                                    defaultValue={this.state.fields.platform}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "platform")}
                                    style={{ marginBottom: '1rem' }}>
                                    {servicePlatforms.map(platform => (
                                        <SelectItem value={platform.val} text={platform.label} />
                                    ))}
                                </Select>}
                                {!this.props.isImport && !this.props.isDuplicate && <Select id="public" name="public"
                                    labelText="Public"
                                    required
                                    defaultValue={this.state.fields.public}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "public")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>}
                                {!this.props.isImport && !this.props.isDuplicate && <Select id="production_ready" name="production_ready"
                                    labelText="Production Ready"
                                    required
                                    defaultValue={!this.state.fields.production_ready ? false : this.state.fields.production_ready}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "production_ready")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>}
                                {!this.props.isImport && !this.props.isDuplicate && <FormGroup legendText="Automation Variables">
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
                                </FormGroup>}
                            </Form>
                            
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : this.props.isDuplicate ? "Duplicate" : "Add"} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }
}
export default ArchitectureModal;