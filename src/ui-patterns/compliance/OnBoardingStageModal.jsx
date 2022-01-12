import React, { Component } from 'react';
import {
    Form,
    ComposedModal,
    ModalBody,
    ModalHeader,
    ModalFooter, 
    FormGroup,
    TextInput
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

import yaml from 'js-yaml';

const endpoint = '/api/on-boarding-stages';

class OnBoardingStageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            overwrite: "",
            fields: {
                label: "",
                secondary_label: "",
                description: "",
                position: -1,
                content: ""
            }
        };
        if (this.props.isUpdate) {
            console.log(this.props)
            let jsonObject = JSON.parse(JSON.stringify(this.props.data));
            jsonObject.content = yaml.dump(JSON.parse(jsonObject.content));
            this.state = {
                fields: jsonObject
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    handleChange(field, e) {
        let fields = this.state.fields;
        if (field === "content") {
            fields[field] = e;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }
    handleSubmit = (event) => {
        event.preventDefault();
        let content;
        try {
            content = JSON.stringify(yaml.load(this.state.fields.content));
        } catch (error) {
            this.props.toast("error", error.name, error.reason);
            console.error(error);
            return;
        }
        if (this.props.isUpdate) {
            fetch(`${endpoint}/${this.props.data.id}`, {
                method: "PATCH",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    label: this.state.fields.label,
                    secondary_label: this.state.fields.secondary_label,
                    description: this.state.fields.description,
                    content: content
                })
            })
            .then(async res => {
                const resObj = await res.json();
                console.log(resObj)
                if (resObj?.error) {
                    this.props.toast("error", "Error", resObj.error.message);
                } else {
                    this.props.toast("success", "Success", `Stage '${resObj.label}' successfully updated!`);
                }
                this.props.closeAndReload();
            })
            .catch(console.error);
        } else if(this.state.fields.label) {
            alert("Not yet implemented");
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a label.");
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
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : "Add"} Stage</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody>

                            <Form name="stageform" onSubmit={this.handleSubmit.bind(this)}>
                                <TextInput
                                    data-modal-primary-focus
                                    id="label"
                                    name="label"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "label")}
                                    value={this.state.fields.label}
                                    labelText="Label"
                                    placeholder="Stage 1"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="secondary_label"
                                    name="secondary_label"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "secondary_label")}
                                    value={this.state.fields.secondary_label}
                                    labelText="Secondary Label"
                                    placeholder="First Stage"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <TextInput
                                    data-modal-primary-focus
                                    id="description"
                                    name="description"
                                    required
                                    invalidText="Please Enter The Value"
                                    onChange={this.handleChange.bind(this, "description")}
                                    value={this.state.fields.description}
                                    labelText="Description"
                                    placeholder="Stage 1: initial environment setup"
                                    style={{ marginBottom: '1rem' }}
                                />
                                <FormGroup legendText="Automation Variables">
                                    <AceEditor
                                        focus
                                        style={{ width: "100%" }}
                                        mode="yaml"
                                        // theme="github"
                                        height="200px"
                                        id="content"
                                        name="content"
                                        placeholder="alias: example"
                                        value={this.state.fields.content}
                                        onChange={this.handleChange.bind(this, "content")}
                                        labelText="Stage Content"
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
export default OnBoardingStageModal;