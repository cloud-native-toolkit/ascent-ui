import React, { Component } from 'react';
import { Form, FormGroup, Select, SelectItem, Button, ButtonSet, ComposedModal, ModalBody, ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput } from 'carbon-components-react';
class ServiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                ibm_service: '',
                desc: '',
                deployment_method: '',
                compatibility: 'No',
                catalog_link: '',
                documentation: '',
                hippa_compliance: '',
                remarks: '',
                provision: '',
                automation: '',
                hybrid_option: ''
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
        let fields = this.state.fields;
        if (field === "compatibility") {
            fields[field] = e;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.props.isUpdate) {
            this.props.service.doPostBOM(this.props.archId, this.state.fields).then(response => {
                console.log(response);
                this.props.handleClose();
            });
        } else {
            this.props.service.doUpdateBOM(this.props.archId, this.state.fields).then(response => {
                console.log(response);
                this.props.handleClose();
            });
        }

    }
    render() {
        console.log(this.props.services);
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <ComposedModal
                        open={this.props.show}
                        onClose={this.props.handleClose}>
                        <ModalHeader >
                            <h2 className="bx--modal-header__label">Service resource</h2>
                            <h3 className="bx--modal-header__heading">Add a Service</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <Select id="ibm_service" name="ibm_service"
                                    labelText="IBM Service"
                                    defaultValue={!this.state.fields.ibm_service ? 'placeholder-item' : this.state.fields.ibm_service}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "ibm_service")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    {this.props.services.map((rows, i) => (
                                        <SelectItem value={rows.service_id} text={rows.service_id} />
                                    ))}

                                </Select>
                                <TextArea
                                    cols={50}
                                    id="desc"
                                    name="desc"
                                    value={this.state.fields.desc}
                                    onChange={this.handleChange.bind(this, "desc")}
                                    invalidText="A valid value is required"
                                    labelText="Description"
                                    placeholder="Service description"
                                    rows={4}
                                />
                                <Select id="deployment_method" name="deployment_method"
                                    labelText="Deployment Method"
                                    defaultValue={!this.state.fields.deployment_method ? 'placeholder-item' : this.state.fields.deployment_method}
                                    invalidText="A valid value is required"
                                    onChange={this.handleChange.bind(this, "deployment_method")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="platform" text="Platform" />
                                    <SelectItem value="cloud managed service" text="Cloud Managed Service" />

                                </Select>
                                <FormGroup legendText="Compatibility">
                                    <RadioButtonGroup
                                        name="compatibility"
                                        onChange={this.handleChange.bind(this, "compatibility")}
                                        defaultSelected={this.state.fields.compatibility}>
                                        <RadioButton
                                            value="Yes"
                                            id="radio-1"
                                            name="compatibility"
                                            labelText="Yes"
                                        />
                                        <RadioButton
                                            value="No"
                                            labelText="No"
                                            name="compatibility"
                                            id="radio-2"
                                        />
                                    </RadioButtonGroup>
                                </FormGroup>
                                <Select id="provision" name="provision"
                                    labelText="Provision"
                                    defaultValue={!this.state.fields.provision ? 'placeholder-item' : this.state.fields.provision}
                                    invalidText="Please Select The Value"
                                    onChange={this.handleChange.bind(this, "provision")}>
                                    <SelectItem
                                        disabled
                                        hidden
                                        value="placeholder-item"
                                        text="Choose an option"
                                    />
                                    <SelectItem value="Terraform" text="Terraform" />
                                    <SelectItem value="Operator" text="Operator" />
                                    <SelectItem value="Ansible" text="Ansible" />
                                </Select>

                                <TextInput
                                    data-modal-primary-focus
                                    id="automation"
                                    name="automation"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.automation}
                                    onChange={this.handleChange.bind(this, "automation")}
                                    labelText="Automation"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="hybrid_option"
                                    name="hybrid_option"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.hybrid_option}
                                    onChange={this.handleChange.bind(this, "hybrid_option")}
                                    labelText="Hybrid Option"
                                    placeholder="e.g. managed_service,platform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="service_id"
                                    name="service_id"
                                    invalidText="Please Enter The Value"

                                    value={this.state.fields.service_id}
                                    onChange={this.handleChange.bind(this, "service_id")}
                                    labelText="service Id"
                                    placeholder="e.g. github.com"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <ButtonSet style={{ margin: '2rem 0 2rem 0' }}>
                                    <Button kind="primary" type="submit" style={{ margin: '0 1rem 0 0' }}>
                                        {!this.props.isUpdate && "Submit"}
                                        {this.props.isUpdate && "Update"}
                                    </Button>
                                    <Button kind='secondary' type="reset" style={{ margin: '0 1rem 0 1rem' }}> Reset</Button>
                                </ButtonSet>
                            </Form>
                        </ModalBody>
                    </ComposedModal>

                </div>
            </div>
        );
    }

}
export default ServiceModal;