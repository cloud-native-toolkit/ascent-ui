import React, { Component } from 'react';
import { Modal, TextInput } from 'carbon-components-react';

class ValidateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputMatch: false,
        };
        this.onInput = this.onInput.bind(this);
    }

    async onInput(e) {
        this.setState({
            inputMatch: e.target.value === this.props.inputRequired
        });
    }

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                <Modal
                    danger={this.props.danger || false}
                    open={this.props.show}
                    modalHeading={this.props.heading || "Validate"}
                    primaryButtonText={this.props.submitText || "Yes"}
                    primaryButtonDisabled={this.props.inputRequired && !this.state.inputMatch}
                    secondaryButtonText="Cancel"
                    onRequestClose={this.props.onClose}
                    onRequestSubmit={this.props.onRequestSubmit}
                    onSecondarySubmit={this.props.onSecondarySubmit}>
                    <p style={{ marginBottom: '1rem' }}>
                        {this.props.message || "This action cannot be undone. Are you sure?"}
                    </p>
                    {this.props.inputRequired && 
                        <TextInput
                            data-modal-primary-focus
                            id="overwrite"
                            name="overwrite"
                            required
                            invalidText="Please Enter The Value"
                            onChange={this.onInput}
                            labelText=""
                            placeholder={this.props.inputRequired}
                            style={{ marginBottom: '1rem' }} />
                    }
                </Modal>

                </div>
            </div>
        );
    }

}
export default ValidateModal;