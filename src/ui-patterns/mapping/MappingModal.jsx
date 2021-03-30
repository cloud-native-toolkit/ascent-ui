import React, { Component } from 'react';
import {
    Form, FormGroup, Button, ButtonSet, ComposedModal, ModalBody, ModalFooter,
    ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput, 
    TextInputSkeleton
} from 'carbon-components-react';


class MappingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            controlsData: [],
            fields: {
                control_id: this.props.controlId || '',
                service_id: this.props.serviceId || '',
                arch_id: '',
                compliant: 'UNKNOWN',
                configuration: '',
                evidence: '',
                scc_goal: '',
                desc: '',
                comment: ''
            }
        };
        if (this.props.isUpdate) {
            this.state = {
                fields: this.props.data
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    async componentDidMount() {
        const controlsData = await this.props.controls.getControls();
        const servicesData = await this.props.services.getServices();
        const archData = await this.props.arch.getArchitectures();
        this.setState({
            controlsData: controlsData,
            servicesData: servicesData,
            archData: archData
        });
    }
    async componentDidUpdate() {
        const controlsData = await this.props.controls.getControls();
        const servicesData = await this.props.services.getServices();
        const archData = await this.props.arch.getArchitectures();
        this.setState({
            controlsData: controlsData,
            servicesData: servicesData,
            archData: archData
        });
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
        if (this.state.fields.control_id && (this.state.fields.service_id || this.state.fields.arch_id) && !this.props.isUpdate) {
            this.props.mapping.addMapping(this.state.fields).then((res) => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", res.body.error.message);
                } else {
                    this.props.handleClose(res);
                }
            });
        } else if (!this.state.fields.control_id) {
            this.props.toast("error", "Error", "You must set a control ID.");
        } else if (!(this.state.fields.service_id || this.state.fields.arch_id)) {
            this.props.toast("error", "Error", "You must set a component ID (either a service or a ref. architecture).");
        } else {
            //this.props.service.doUpdateService(this.state.fields, this.state.fields.service_id);
            this.props.handleClose();
        }
    }
    render() {
        let controlsData = this.state.controlsData;
        let servicesData = this.state.servicesData;
        let archData = this.state.archData;
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <ComposedModal
                        open={this.props.show}
                        onClose={this.props.handleClose}>
                        <ModalHeader >
                            <h3 className="bx--modal-header__heading">Add Mapping</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform">

                                {
                                    controlsData && controlsData.length > 0 ?
                                        <>
                                            <datalist id="control_ids">
                                                {controlsData.map((control) => (
                                                    <option value={control.control_id} />
                                                ))}
                                            </datalist>
                                            <TextInput
                                                list="control_ids"
                                                required
                                                data-modal-primary-focus
                                                id="control_id"
                                                name="control_id"
                                                disabled={this.props.isUpdate || this.props.controlId ? true : false}
                                                hidden={this.props.controlId ? true : false}
                                                invalidText="Please Enter The Value"
                                                onChange={this.handleChange.bind(this, "control_id")}
                                                value={this.state.fields.control_id}
                                                labelText={this.props.controlId ? "" : "Control ID"}
                                                placeholder="e.g. AC-2 (4), SC-12, SI-11, etc."
                                                style={{ marginBottom: '1rem' }}
                                            />
                                        </> :!(this.props.controlId) &&  <TextInputSkeleton />
                                }
                                {
                                    servicesData && servicesData.length > 0 ?
                                        <>
                                            <datalist id="service_ids">
                                                {servicesData.map((service) => (
                                                    <option value={service.service_id} />
                                                ))}
                                            </datalist>
                                            <TextInput
                                                list="service_ids"
                                                data-modal-primary-focus
                                                id="service_id"
                                                name="service_id"
                                                disabled={this.state.fields.arch_id || this.props.serviceId ? true : false}
                                                hidden={this.props.serviceId ? true : false}
                                                invalidText="Please Enter The Value"
                                                onChange={this.handleChange.bind(this, "service_id")}
                                                value={this.state.fields.service_id}
                                                labelText={this.props.serviceId ? "" : "Service ID"}
                                                placeholder="e.g. cloud-object-storage, appid"
                                                style={{ marginBottom: '1rem' }}
                                            />
                                        </> 
                                    : !(this.props.serviceId) && <TextInputSkeleton />
                                }
                                {
                                    archData && archData.length > 0 ?
                                        <>
                                            <datalist id="arch_ids">
                                                {archData.map((arch) => (
                                                    <option value={arch.arch_id} />
                                                ))}
                                            </datalist>
                                            <TextInput
                                                list="arch_ids"
                                                data-modal-primary-focus
                                                id="arch_id"
                                                name="arch_id"
                                                disabled={this.state.fields.service_id ? true : false}
                                                hidden={this.props.serviceId ? true : false}
                                                invalidText="Please Enter The Value"
                                                onChange={this.handleChange.bind(this, "arch_id")}
                                                value={this.state.fields.arch_id}
                                                labelText={this.props.serviceId ? "" : "Ref. Architecture ID"}
                                                placeholder="e.g. simple, dev-env"
                                                style={{ marginBottom: '1rem' }}
                                            />
                                        </> : !(this.props.serviceId) && <TextInputSkeleton />
                                }
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
                                    style={{ marginBottom: '1rem' }}
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
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    cols={50}
                                    id="scc_goal"
                                    name="scc_goal"
                                    value={this.state.fields.scc_goal}
                                    onChange={this.handleChange.bind(this, "scc_goal")}
                                    invalidText="A valid value is required"
                                    labelText="SCC Goal"
                                    placeholder="e.g. 3000106,3000114,etc."
                                    rows={1}
                                    style={{ marginBottom: '1rem' }}
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
                                    style={{ marginBottom: '1rem' }}
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
                                    style={{ marginBottom: '1rem' }}
                                />
                            </Form>
                        </ModalBody>
                        <ModalFooter onRequestSubmit={this.handleSubmit} primaryButtonText={this.props.isUpdate ? "Update" : "Submit"} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }

}
export default MappingModal;