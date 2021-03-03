import React, { Component } from 'react';
import { Form, FormGroup, DatePickerInput, Button, ButtonSet, DatePicker, ComposedModal, ModalBody, ModalHeader, RadioButtonGroup, RadioButton, TextArea, TextInput } from 'carbon-components-react';
class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show
        };
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
                            <Form>

                                <TextInput
                                    data-modal-primary-focus
                                    id="seviceId"
                                    labelText="Service ID"
                                    placeholder="e.g. appid,atracker,cos"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="group"
                                    labelText="Grouping"
                                    placeholder="e.g. databases,compute,network"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="ibmService"
                                    labelText="IBM Service"
                                    placeholder="e.g. App ID,Databases for Redis ect..."
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextArea
                                    cols={50}
                                    id="desc"
                                    invalidText="A valid value is required"
                                    labelText="Description"
                                    placeholder="Service description"
                                    rows={4}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="dplMethod"
                                    labelText="Deployment Method"
                                    placeholder="e.g. managed_service,platform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup {...fieldsetRadioProps}>
                                    <RadioButtonGroup
                                        name="radio-button-group"
                                        defaultSelected="default-selected">
                                        <RadioButton
                                            value="standard"
                                            id="radio-1"
                                            labelText="True"
                                        />
                                        <RadioButton
                                            value="default-selected"
                                            labelText="False"
                                            id="radio-2"
                                        />
                                    </RadioButtonGroup>
                                </FormGroup>
                                <TextInput
                                    data-modal-primary-focus
                                    id="quarter"
                                    labelText="Quarter"
                                    placeholder="e.g. github.com"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <DatePicker datePickerType="single">
                                    <DatePickerInput
                                        placeholder="mm/dd/yyyy"
                                        labelText="Date"
                                        id="date-time"
                                    />
                                </DatePicker>
                                <TextInput
                                    data-modal-primary-focus
                                    id="provision"
                                    labelText="Provision"
                                    placeholder="e.g. terraform"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="caId"
                                    labelText="CAID"
                                    placeholder="e.g. ibm-access-group"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="haId"
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