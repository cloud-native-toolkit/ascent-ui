import React, { Component } from 'react';
import { Modal } from 'carbon-components-react';

class ValidateModal extends Component {

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                <Modal 
                    open={this.props.show}
                    modalHeading={this.props.heading || "Validate"}
                    modalLabel={this.props.label || "Validate"}
                    primaryButtonText="Yes"
                    secondaryButtonText="Cancel"
                    onClose={this.props.onClose}
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