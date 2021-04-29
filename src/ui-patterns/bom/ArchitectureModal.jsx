import React, { Component } from 'react';
import {
    Form, ComposedModal, ModalBody, ModalHeader, ModalFooter, FormGroup
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

class ArchitectureModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            fields: {
                automation_variables: "alias: example\nvariables:\n  - name: var_1\n  value: value_1\n  - name: var_2\n  value: value_2"
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
        if (field === "automation_variables") {
            fields[field] = e;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.fields.arch_id && !this.props.isUpdate) {
            this.props.toast("error", "NOT IMPLEMENTED", "Not yet implemented.");
        } else if(this.state.fields.arch_id) {
            this.props.architectureService.updateArchitecture(this.props.data.arch_id, {
                automation_variables: this.state.fields.automation_variables
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", res.body.error.message);
                } else {
                    this.props.toast("success", "Success", `Architecture ${res.arch_id} successfully updated!`);
                    this.props.handleClose();
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set an architecture ID.");
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : "Add"} Architecture</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>
                            <Form name="architectureform" onSubmit={this.handleSubmit.bind(this)}>
                                <FormGroup legendText="Automation Variables">
                                    <AceEditor
                                        focus
                                        style={{ width: "100%" }}
                                        mode="yaml"
                                        // theme="github"
                                        height="200px"
                                        id="automation_variables"
                                        name="automation_variables"
                                        placeholder="yaml"
                                        value={this.state.fields.automation_variables}
                                        onChange={this.handleChange.bind(this, "automation_variables")}
                                        labelText="Automation Variables"
                                        ref="editorInput"
                                        // fontSize={20}
                                        showPrintMargin
                                        showGutter={true}
                                        highlightActiveLine
                                        setOptions={{
                                            enableBasicAutocompletion: false,
                                            enableLiveAutocompletion: false,
                                            enableSnippets: false,
                                            showLineNumbers: true,
                                            tabSize: 2
                                        }}
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                </FormGroup>
                            </Form>
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : "Add"} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }
}
export default ArchitectureModal;