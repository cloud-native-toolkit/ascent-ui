import React, { Component } from 'react';
import {
    Form, Select, SelectItem, ComposedModal, 
    ModalBody, ModalHeader, TextArea,
    ModalFooter 
} from 'carbon-components-react';


class ServiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                desc: ''
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
                            <h3 className="bx--modal-header__heading">Add a Service</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>

                                <Select id="service_id" name="service_id"
                                    labelText="Service ID"
                                    required
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
                                        <SelectItem value={rows.service_id} text={rows.service_id} />
                                    ))}

                                </Select>
                                <br />
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
                            </Form>
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : "Submit"} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }

}
export default ServiceModal;