import React, { Component } from 'react';
import { Form, FormGroup, InlineNotification, Select, SelectItem, Button, 
    ButtonSet, ComposedModal, ModalBody, ModalFooter, ModalHeader, 
    RadioButtonGroup, RadioButton, TextArea, TextInput, SelectSkeleton,
    MultiSelect
} from 'carbon-components-react';

import {
    servicePlatforms,
    serviceGroupings,
    serviceDeploymentMethods,
    serviceProvisionMethods
} from '../data/data';

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
                fullname: '',
                ibm_catalog_id: '',
                fs_validated: false
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"service_id\":"));
            console.log(jsonObject);
            this.state = {
                fields: {
                    service_id: jsonObject.service_id,
                    fullname: jsonObject.serviceDetails?.fullname,
                    ibm_catalog_id: jsonObject.serviceDetails?.ibm_catalog_id,
                    fs_validated: jsonObject.serviceDetails?.fs_validated
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
        if (field === "fs_validated") {
            fields[field] = e.target.value === "false" ? false : true;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    validateForm() {
        let fields = this.state.fields
        return fields.service_id ? true: false;
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update a Service": "Add a Service"}</h3>
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
                                    id="serviceName"
                                    name="fullname"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.fullname}
                                    onChange={this.handleChange.bind(this, "fullname")}
                                    labelText="Service Name"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    id="serviceCatalogId"
                                    name="ibm_catalog_id"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.ibm_catalog_id}
                                    onChange={this.handleChange.bind(this, "ibm_catalog_id")}
                                    labelText="IBM Catalog ID"
                                    placeholder="e.g. kms, openshift, ..."
                                    style={{ marginBottom: '1rem' }}
                                />
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