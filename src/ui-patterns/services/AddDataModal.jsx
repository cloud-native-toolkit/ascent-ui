import React, { Component } from 'react';
import { Form, FormGroup, InlineNotification, Select, SelectItem, Button, 
    ButtonSet, ComposedModal, ModalBody, ModalFooter, ModalHeader, 
    RadioButtonGroup, RadioButton, TextArea, TextInput, SelectSkeleton
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            caids: [],
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            notif: false,
            fields: {
                service_id: '',
                ibm_catalog_service: '',
                grouping: '',
                fs_validated: false,
                deployment_method: '',
                provision: '',
                cloud_automation_id: '',
                desc: '',
                default_automation_variables: ''
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"service_id\":"));
            this.state = {
                fields: {
                    service_id: jsonObject.service_id,
                    ibm_catalog_service: jsonObject.ibm_catalog_service,
                    grouping: jsonObject.grouping,
                    deployment_method: jsonObject.deployment_method,
                    fs_validated: jsonObject.fs_validated,
                    provision: jsonObject.provision,
                    cloud_automation_id: jsonObject.cloud_automation_id,
                    desc: jsonObject.desc,
                    default_automation_variables: jsonObject.default_automation_variables
                }
            }
        }
        this.props.automationService.getAutomationIds().then(res => {
            if (res && res.data && res.data.length) {
                this.setState({caids: res.data});
            }
        })
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(field, e) {
        let fields = this.state.fields;
        if (field === "default_automation_variables") {
            fields[field] = e;
        } else if (field === "fs_validated") {
            fields[field] = e.target.value === "false" ? false : true;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    validateForm() {
        let fields = this.state.fields
        return fields.service_id && fields.ibm_catalog_service && fields.grouping && fields.deployment_method && fields.provision ? true: false;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateForm()) {
            if (!this.props.isUpdate) {
                this.props.service.doAddService(this.state.fields).then((res) => {
                    if (res?.body?.error) {
                        console.log(res?.body?.error);
                        this.props.toast("error", "Error", res.body.error.message);
                    } else {
                        this.props.toast("success", "Success", `Service ${res.service_id} successfully created!`);
                        this.props.handleClose();
                    }
                });
            } else {
                this.props.service.doUpdateService(this.state.fields, this.state.fields.service_id).then((res) => {
                    if (res?.body?.error) {
                        console.log(res?.body?.error);
                        this.props.toast("error", "Error", res.body.error.message);
                    } else {
                        this.props.toast("success", "Success", `Service ${res.service_id} successfully updated!`);
                        this.props.handleClose();
                    }
                });
            }
        } else {
            this.props.toast("error", "INVALID INPUT", 'You must set a valid service ID, service name, grouping, deployment method and provisionning method.');
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
                            <h3 className="bx--modal-header__heading">Add a Service</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform">

                                <TextInput
                                    data-modal-primary-focus
                                    id="seviceId"
                                    name="service_id"
                                    disabled={this.props.isUpdate ? true : false}
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "service_id")}
                                    value={this.state.fields.service_id}
                                    labelText="Service ID"
                                    placeholder="e.g. appid,atracker,cos"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    id="ibmService"
                                    name="ibm_catalog_service"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.ibm_catalog_service}
                                    onChange={this.handleChange.bind(this, "ibm_catalog_service")}
                                    labelText="Service Name"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <Select id="group" name="grouping"
                                    labelText="Grouping"
                                    defaultValue={!this.state.fields.grouping ? 'placeholder-item' : this.state.fields.grouping}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "grouping")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Security & Identity" text="Security & Identity" />
                                    <SelectItem value="Developer Tools" text="Developer Tools" />
                                    <SelectItem value="SRE Tools" text="SRE Tools" />
                                    <SelectItem value="Databases" text="Databases" />
                                    <SelectItem value="Network" text="Network" />
                                    <SelectItem value="Storage" text="Storage" />
                                    <SelectItem value="Compute" text="Compute" />
                                    <SelectItem value="IBM Cloud Platform Services" text="IBM Cloud Platform Services" />
                                </Select>
                                <Select id="dplMethod"
                                    name="deployment_method"
                                    invalidText="Please Enter The Value"
                                    labelText="Deployment Method"
                                    defaultValue={!this.state.fields.deployment_method ? 'placeholder-item' : this.state.fields.deployment_method}
                                    onChange={this.handleChange.bind(this, "deployment_method")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Managed Service" text="Managed Service" />
                                    <SelectItem value="Platform" text="Platform" />
                                    <SelectItem value="Operator" text="Operator" />
                                    <SelectItem value="Helm" text="Helm" />
                                </Select>
                                <Select id="fs_validated"
                                    name="fs_validated"
                                    invalidText="Please Enter The Value"
                                    labelText="FS Validated"
                                    defaultValue={this.state.fields.fs_validated}
                                    onChange={this.handleChange.bind(this, "fs_validated")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem value={false} text="False" />
                                    <SelectItem value={true} text="True" />
                                </Select>
                                <Select id="provision" name="provision"
                                    labelText="Provision"
                                    defaultValue={!this.state.fields.provision ? 'placeholder-item' : this.state.fields.provision}
                                    invalidText="Please Select The Value"
                                    onChange={this.handleChange.bind(this, "provision")}
                                    style={{ marginBottom: '1rem' }}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Terraform" text="Terraform" />
                                    <SelectItem value="Operator" text="Operator" />
                                    <SelectItem value="Ansible" text="Ansible" />
                                    <SelectItem value="Helm" text="Helm" />
                                </Select>
                                {
                                    this.state.caids && this.state.caids.length > 0 ?
                                        <>
                                        <Select id="caId" name="cloud_automation_id"
                                            labelText="Automation ID"
                                            defaultValue={!this.state.fields.cloud_automation_id ? 'placeholder-item' : this.state.fields.cloud_automation_id}
                                            invalidText="Please Select The Value"
                                            onChange={this.handleChange.bind(this, "cloud_automation_id")}
                                            style={{ marginBottom: '1rem' }}>
                                            <SelectItem
                                                disabled
                                                hidden
                                                value="placeholder-item"
                                                text="Choose an option"
                                            />
                                            {this.state.caids.map(caid => (
                                                <SelectItem value={caid.name} text={caid.name} />
                                            ))}
                                        </Select>
                                        </> : <SelectSkeleton style={{ marginBottom: '1rem' }}/>
                                }
                                <TextArea
                                    cols={50}
                                    id="desc"
                                    name="desc"
                                    value={this.state.fields.desc}
                                    onChange={this.handleChange.bind(this, "desc")}
                                    invalidText="A valid value is required"
                                    labelText="Description"
                                    placeholder="Service description"
                                    rows={2}
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup legendText="Default Automation Variables">
                                    <AceEditor
                                        focus
                                        style={{ width: "100%" }}
                                        mode="yaml"
                                        // theme="github"
                                        height="200px"
                                        id="default_automation_variables"
                                        name="default_automation_variables"
                                        placeholder="alias: example"
                                        value={this.state.fields.default_automation_variables}
                                        onChange={this.handleChange.bind(this, "default_automation_variables")}
                                        labelText="Default Automation Variables"
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
                        <ModalFooter onRequestSubmit={this.handleSubmit} primaryButtonText={this.props.isUpdate ? "Update" : "Add"} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }

}
export default FormModal;