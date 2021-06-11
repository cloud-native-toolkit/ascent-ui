import React, { Component } from 'react';
import {
    Form, Select, SelectItem, ComposedModal, 
    ModalBody, ModalHeader, TextInput,
    ModalFooter, FormGroup
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

class ServiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                desc: '',
                automation_variables: ""
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"_id\":"));
            this.state = {
                fields: jsonObject
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(field, e) {
        console.log(e)
        let fields = this.state.fields;
        if (field === "automation_variables") {
            fields[field] = e;
        } else if (field === "service_id") {
            fields["automation_variables"] = this.props.services.find((service) => service.service_id === e.target.value)?.default_automation_variables || "";
            fields[field] = e.target.value;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.fields.service_id && !this.props.isUpdate) {
            this.props.service.doPostBOM(this.props.archId, this.state.fields).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", `${res.body.error.message}${res.body.error?.details?.reason && " Reason: " + res.body.error.details.reason}`);
                } else {
                    this.props.toast("success", "Success", `Service ${res.service_id} successfully added to ref. architecture ${res.arch_id}!`);
                    this.props.handleClose();
                }
            });
        } else if(this.state.fields.service_id) {
            this.props.service.doUpdateBOM(this.props.data.id, {
                desc: this.state.fields.desc,
                automation_variables: this.state.fields.automation_variables
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", `${res.body.error.message}${res.body.error?.details?.reason && " Reason: " + res.body.error.details.reason}`);
                } else {
                    this.props.toast("success", "Success", `Service ${res.service_id} successfully updated!`);
                    this.props.handleClose();
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a service ID.");
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : "Add"} a Service</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <Select id="service_id" name="service_id"
                                    labelText="Service ID"
                                    required
                                    disabled={this.props.isUpdate}
                                    defaultValue={!this.state.fields.service_id ? 'placeholder-item' : this.state.fields.service_id}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "service_id")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    {this.props.services.map((rows, i) => (
                                        <SelectItem value={rows.service_id} text={rows.ibm_catalog_service || rows.service_id} />
                                    ))}

                                </Select>
                                <br />
                                <TextInput
                                    id="desc"
                                    name="desc"
                                    value={this.state.fields.desc}
                                    onChange={this.handleChange.bind(this, "desc")}
                                    invalidText="A valid value is required"
                                    labelText="Description"
                                    placeholder="Service description"
                                    rows={4}
                                    style={{ marginBottom: '1rem' }}
                                />
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
export default ServiceModal;