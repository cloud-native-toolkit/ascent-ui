import React, { Component } from 'react';
import { Form, FormGroup, DatePickerInput, Button, ButtonSet, DatePicker, ComposedModal, ModalBody, ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput } from 'carbon-components-react';
class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            fields: {
                service_id: null,
                grouping: null,
                ibm_service: null,
                desc: null,
                deployment_method: null,
                fs_ready: false,
                quarter: null,
                date: null,
                provision: null,
                cloud_automation_id: null,
                hybrid_automation_id: null
            }
        };
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(field, e) {
        let fields = this.state.fields;
        if (field === "fs_ready") {
            fields[field] = e;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });

    }
    handleSubmit = (event) => {
        event.preventDefault();
        console.log(this.state.fields);
        const jsonData = this.props.service.doAddService(this.state.fields);
    }
    render() {
        const fieldsetRadioProps = {
            className: 'some-class',
            legendText: 'FS Ready',
        };
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <ComposedModal
                        open={this.props.show}
                        onRequestClose={this.props.handleClose}>
                        <ModalHeader >
                            <h2 class="bx--modal-header__label">Service resource</h2>
                            <h3 class="bx--modal-header__heading">Add a Service</h3>
                            <button class="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody hasScrollingContent>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <TextInput
                                    data-modal-primary-focus
                                    id="seviceId"
                                    name="service_id"
                                    onChange={this.handleChange.bind(this, "service_id")}
                                    value={this.state.fields.service_id}
                                    labelText="Service ID"
                                    placeholder="e.g. appid,atracker,cos"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="group"
                                    name="grouping"
                                    value={this.state.fields.grouping}
                                    onChange={this.handleChange.bind(this, "grouping")}
                                    labelText="Grouping"
                                    placeholder="e.g. databases,compute,network"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="ibmService"
                                    name="ibm_service"
                                    value={this.state.fields.ibm_service}
                                    onChange={this.handleChange.bind(this, "ibm_service")}
                                    labelText="IBM Service"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
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
                                <TextInput
                                    data-modal-primary-focus
                                    id="dplMethod"
                                    name="deployment_method"
                                    value={this.state.fields.deployment_method}
                                    onChange={this.handleChange.bind(this, "deployment_method")}
                                    labelText="Deployment Method"
                                    placeholder="e.g. managed_service,platform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup {...fieldsetRadioProps}>
                                    <RadioButtonGroup
                                        name="fs_ready"
                                        onChange={this.handleChange.bind(this, "fs_ready")}
                                        defaultSelected={this.state.fields.fs_ready}>
                                        <RadioButton
                                            value="true"
                                            id="radio-1"
                                            name="fs_ready"
                                            labelText="True"
                                        />
                                        <RadioButton
                                            value="false"
                                            labelText="False"
                                            name="fs_ready"
                                            id="radio-2"
                                        />
                                    </RadioButtonGroup>
                                </FormGroup>
                                <TextInput
                                    data-modal-primary-focus
                                    id="quarter"
                                    name="quarter"
                                    value={this.state.fields.quarter}
                                    onChange={this.handleChange.bind(this, "quarter")}
                                    labelText="Quarter"
                                    placeholder="e.g. github.com"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <DatePicker datePickerType="single">
                                    <DatePickerInput
                                        placeholder="mm/dd/yyyy"
                                        labelText="Date"
                                        id="date-time"
                                        name="date"
                                        value={this.state.fields.date}
                                        onFocus={this.handleChange.bind(this, "date")}

                                    />
                                </DatePicker>
                                <TextInput
                                    data-modal-primary-focus
                                    id="provision"
                                    name="provision"
                                    value={this.state.fields.provision}
                                    onChange={this.handleChange.bind(this, "provision")}
                                    labelText="Provision"
                                    placeholder="e.g. terraform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="caId"
                                    name="cloud_automation_id"
                                    value={this.state.fields.cloud_automation_id}
                                    onChange={this.handleChange.bind(this, "cloud_automation_id")}
                                    labelText="CAID"
                                    placeholder="e.g. ibm-access-group"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="haId"
                                    name="hybrid_automation_id"
                                    value={this.state.fields.hybrid_automation_id}
                                    onChange={this.handleChange.bind(this, "hybrid_automation_id")}
                                    labelText="HAID"
                                    placeholder="e.g. github.com"
                                    style={{ marginBottom: '1rem' }}
                                />

                                <ButtonSet style={{ margin: '2rem 0 2rem 0' }}>
                                    <Button kind="primary" type="submit" style={{ margin: '0 1rem 0 0' }}>Submit</Button>
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
export default FormModal;