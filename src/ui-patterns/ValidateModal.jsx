import React, { Component } from 'react';
import { Modal } from 'carbon-components-react';

class ValidateModal extends Component {

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                <Modal
                    danger={this.props.danger || false}
                    open={this.props.show}
                    modalHeading={this.props.heading || "Validate"}
                    primaryButtonText={this.props.submitText || "Yes"}
                    secondaryButtonText="Cancel"
                    onRequestClose={this.props.onClose}
                    onRequestSubmit={this.props.onRequestSubmit}
                    onSecondarySubmit={this.props.onSecondarySubmit}>
                    <p style={{ marginBottom: '1rem' }}>
                        {this.props.message || "This action cannot be undone. Are you sure?"}
                    </p>
                </Modal>

                </div>
            </div>
        );
    }

}
export default ValidateModal;