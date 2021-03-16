import React, { Component } from 'react';
import { Form, FormGroup, Button, ButtonSet, ComposedModal, ModalBody, ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput } from 'carbon-components-react';

class MapControlToServiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                control_id: '',
                compliant: 'UNKNOWN',
                configuration: '',
                evidence: '',
                scc_goal: '',
                desc: '',
                comment: ''
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/\"id\":/g, "\"control_id\":"));
            this.state = {
                fields: jsonObject
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(field, e) {
        let fields = this.state.fields;
        if (field === "compliant") {
            fields[field] = e;
        } else {
            fields[field] = e.target.value;
        }
        console.log(fields);
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.props.isUpdate) {
            this.props.service.doMapControl(this.state.fields, this.props.serviceId).then((res) => {
                this.props.handleClose(res);
            });
        } else {
            //this.props.service.doUpdateService(this.state.fields, this.state.fields.service_id);
            this.props.handleClose();
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
                            <h2 className="bx--modal-header__label">Service resource</h2>
                            <h3 className="bx--modal-header__heading">Add a impacting control</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <TextInput
                                    required
                                    data-modal-primary-focus
                                    id="control_id"
                                    name="control_id"
                                    disabled={this.props.isUpdate ? true : false}
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "control_id")}
                                    value={this.state.fields.control_id}
                                    labelText="Control ID"
                                    placeholder="e.g. AC-2 (4), SC-12, SI-11, etc."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup legendText="Compliant">
                                    <RadioButtonGroup
                                        required
                                        name="compliant"
                                        onChange={this.handleChange.bind(this, "compliant")}
                                        defaultSelected={this.state.fields.compliant}>
                                        <RadioButton
                                            value="TRUE"
                                            id="radio-1"
                                            name="compliant"
                                            labelText="True"
                                        />
                                        <RadioButton
                                            value="FALSE"
                                            labelText="False"
                                            name="compliant"
                                            id="radio-2"
                                        />
                                        <RadioButton
                                            value="UNKNOWN"
                                            labelText="Unknown"
                                            name="compliant"
                                            id="radio-3"
                                        />
                                    </RadioButtonGroup>
                                </FormGroup>
                                <TextInput
                                    required
                                    cols={50}
                                    id="configuration"
                                    name="configuration"
                                    value={this.state.fields.configuration}
                                    onChange={this.handleChange.bind(this, "configuration")}
                                    invalidText="A valid value is required"
                                    labelText="Configuration"
                                    placeholder="e.g. IAM roles enabled, Responsibility of COS, etc."
                                    rows={1}
                                />
                                <TextInput
                                    required
                                    cols={50}
                                    id="evidence"
                                    name="evidence"
                                    value={this.state.fields.evidence}
                                    onChange={this.handleChange.bind(this, "evidence")}
                                    invalidText="A valid value is required"
                                    labelText="Evidence"
                                    placeholder="e.g. COS FS-Ready validation, SCC Scan / Resource groups, etc."
                                    rows={1}
                                />
                                <TextInput
                                    cols={50}
                                    id="scc_goal"
                                    name="scc_goal"
                                    value={this.state.fields.scc_goal}
                                    onChange={this.handleChange.bind(this, "scc_goal")}
                                    invalidText="A valid value is required"
                                    labelText="Evidence"
                                    placeholder="e.g. 3000106, 3000114, etc."
                                    rows={1}
                                />
                                <TextArea
                                    required
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
                                <TextArea
                                    cols={50}
                                    id="comment"
                                    name="comment"
                                    value={this.state.fields.comment}
                                    onChange={this.handleChange.bind(this, "comment")}
                                    labelText="Comment"
                                    placeholder="Optionnal comment"
                                    rows={4}
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
export default MapControlToServiceModal;