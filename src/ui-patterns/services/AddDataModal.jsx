import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button, ComposedModal, Modal, TextInput, Select, SelectItem } from 'carbon-components-react';
class FormModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (

            <div className="bx--grid">


                <div className="bx--row">
                    <Modal
                        open
                        modalHeading="Add a custom domain"
                        modalLabel="Account resources"
                        primaryButtonText="Add"
                        secondaryButtonText="Cancel">
                        <p style={{ marginBottom: '1rem' }}>
                            Custom domains direct requests for your apps in this Cloud Foundry
                            organization to a URL that you own. A custom domain can be a shared
                            domain, a shared subdomain, or a shared domain and host.
      </p>
                        <TextInput
                            data-modal-primary-focus
                            id="text-input-1"
                            labelText="Domain name"
                            placeholder="e.g. github.com"
                            style={{ marginBottom: '1rem' }}
                        />
                        <Select id="select-1" defaultValue="us-south" labelText="Region">
                            <SelectItem value="us-south" text="US South" />
                            <SelectItem value="us-east" text="US East" />
                        </Select>
                    </Modal>
                </div>
            </div>
        );
    }

}
export default FormModal;