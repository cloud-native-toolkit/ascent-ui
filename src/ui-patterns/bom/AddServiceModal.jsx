import React, { Component } from 'react';
import {
    Form, ComposedModal,
    ModalBody, ModalHeader, TextInput,
    ModalFooter, FormGroup,
    Column, Grid, Row, Tag
} from 'carbon-components-react';

import AceEditor from "react-ace";
import "brace/mode/yaml";

import {
    StatefulTileCatalog
} from 'carbon-addons-iot-react';
import {
    Add32 as Add
} from '@carbon/icons-react';

import { catalogFilters } from '../data/data';
import CatalogFilter from './CatalogFilter';

const CatalogContent = ({ icon, title, displayName, status, type, description }) => (
    <div className={`iot--sample-tile`}>
        {icon ? <div className={`iot--sample-tile-icon`}>{icon}</div> : null}
        <div className={`iot--sample-tile-contents`}>
            <div className={`iot--sample-tile-title`}>
                <span title={title}>{displayName}</span>
                {(type === 'terraform' || type === 'gitops') && <Tag
                    style={{marginLeft: '.5rem'}}
                    type='gray' >
                    {catalogFilters.moduleTypeValues.find(v => v.value === type)?.text}
                </Tag>}
                {(status === 'beta' || status === 'pending') && <Tag
                    style={{marginLeft: '.5rem'}}
                    type={status === 'beta' ? 'teal' : 'magenta'} >
                    {catalogFilters.statusValues.find(v => v.value === status)?.text}
                </Tag>}
            </div>
            <div className={`iot--sample-tile-description`}>{description ? `${description?.slice(0, 95)}${description?.length > 95 ? '...' : ''}` : title}</div>
        </div>
    </div>
);
const tileRenderFunction = ({ values }) => <CatalogContent {...values} icon={<Add />} />;

class ServiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
            onRequestClose: this.props.handleClose,
            catalogFilters: {
                category: '',
                cloudProvider: '',
                softwareProvider: '',
                moduleType: '',
                status: '',
                searchText: ''
            },
            filteredCatalog: [],
            step: 1,
            fields: {
                service_id: '',
                arch_id: this.props.archId,
                desc: '',
                automation_variables: ""
            }
        };
        if (this.props.isUpdate) {
            let jsonObject = JSON.parse(JSON.stringify(this.props.data).replace(/"id":/g, "\"_id\":"));
            this.state.fields = jsonObject;
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.filterCatalog = this.filterCatalog.bind(this);
    }

    componentDidMount() {
        this.filterCatalog('searchText', '');
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        if (field === "automation_variables") {
            fields[field] = e;
        } else if (field === "service_id") {
            fields["automation_variables"] = "";
            fields[field] = e.target.value;
        } else {
            fields[field] = e.target.value;
        }
        this.setState({ fields });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (!this.props.isUpdate && this.state.step === 1) {
            this.setState({ step: this.state.step + 1});
        } else if (this.state.fields.service_id && !this.props.isUpdate) {
            this.props.service.doPostBOM(this.props.archId, this.state.fields).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", `${res.body.error.message}${res.body.error?.details?.reason && " Reason: " + res.body.error.details.reason}`);
                } else {
                    this.props.toast("success", "Success", `Service ${res.service_id} successfully added to ref. architecture ${res.arch_id}!`);
                    this.props.handleClose();
                }
            });
        } else if (this.state.fields.service_id) {
            this.props.service.doUpdateBOM(this.props.data.id, {
                desc: this.state.fields.desc,
                automation_variables: this.state.fields.automation_variables
            }).then(res => {
                if (res && res.body && res.body.error) {
                    this.props.toast("error", "Error", `${res.body.error.message}${res.body.error?.details?.reason && " Reason: " + res.body.error.details.reason}`);
                } else {
                    this.props.toast("success", "Success", `Service ${res.service_id} successfully updated!`);
                    this.props.handleClose();
                }
            });
        } else {
            this.props.toast("error", "INVALID INPUT", "You must set a service ID.");
        }
    }

    filterCatalog = (filter, val) => {
        const catalogFilters = this.state.catalogFilters;
        catalogFilters[filter] = val;
        let filteredCatalog = this.props.services;
        if (catalogFilters.searchText) filteredCatalog = filteredCatalog.filter(m => m.name?.includes(catalogFilters.searchText) || m.service_id?.includes(catalogFilters.searchText) || m.description?.includes(catalogFilters.searchText));
        if (catalogFilters.category) filteredCatalog = filteredCatalog.filter(m => m.category === catalogFilters.category);
        if (catalogFilters.cloudProvider) filteredCatalog = filteredCatalog.filter(m => m.cloudProvider === catalogFilters.cloudProvider);
        if (catalogFilters.softwareProvider) filteredCatalog = filteredCatalog.filter(m => m.softwareProvider === catalogFilters.softwareProvider);
        if (catalogFilters.moduleType) filteredCatalog = filteredCatalog.filter(m => m.type === catalogFilters.moduleType);
        if (catalogFilters.status) filteredCatalog = filteredCatalog.filter(m => m.status === catalogFilters.status);
        this.setState({
            catalogFilters: catalogFilters,
            filteredCatalog: filteredCatalog
        });
    }

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row modal-wizard">
                    <ComposedModal
                        open={this.props.show}
                        onClose={this.props.handleClose}>
                        <ModalHeader >
                            <h3 className="bx--modal-header__heading">{this.props.isUpdate ? "Update" : "Add"} Module</h3>
                            <button className="bx--modal-close" type="button" title="Close" aria-label="Close"></button>
                        </ModalHeader>
                        <ModalBody style={{paddingRight: '1rem'}}>

                            { !this.props.isUpdate && this.state.step === 1 &&
                                <Grid>
                                    <Row>
                                        <Column lg={{span: 2}} md={{span: 2}} sm={{span: 4}}>
                                            <br />
                                            <br />
                                            <CatalogFilter
                                                filterCatalog={this.filterCatalog}
                                                catalogFilters={this.state.catalogFilters} />
                                        </Column>
                                        <Column lg={{span: 10}} md={{span: 6}} sm={{span: 4}}>
                                            <StatefulTileCatalog
                                                title='Automation Catalog'
                                                id='automation-catalog'
                                                tiles={
                                                    this.state.filteredCatalog
                                                    .sort(function (a, b) { return a.service_id.toUpperCase() < b.service_id.toUpperCase() ? -1 : 1 })
                                                    .map((service) => (
                                                        {
                                                            id: service.service_id,
                                                            values: {
                                                                title: service.service_id,
                                                                displayName: service.displayName,
                                                                status: service.status,
                                                                type: service.type,
                                                                description: service.description,
                                                            },
                                                            renderContent: tileRenderFunction,
                                                        }
                                                    ))
                                                }
                                                pagination={{ pageSize: 12 }}
                                                isSelectedByDefault={false}
                                                onSelection={(val) => this.setState({ fields: {
                                                    ...this.state.fields,
                                                    service_id: val
                                                }})} />
                                        </Column>
                                    </Row>
                                </Grid>
                            }
                            
                            { (this.props.isUpdate || this.state.step > 1) &&
                                <Form name="serviceform" onSubmit={this.handleSubmit.bind(this)}>
                                    <TextInput
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
                                    <FormGroup legendText="Automation Variables">
                                        <AceEditor
                                            focus
                                            style={{ width: "100%" }}
                                            mode="yaml"
                                            // theme="github"
                                            height="200px"
                                            id="automation_variables"
                                            name="automation_variables"
                                            placeholder="alias: example"
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
                            }
                        </ModalBody>
                        <ModalFooter primaryButtonText={this.props.isUpdate ? "Update" : this.state.step === 1 ? "Next" : "Add"} primaryButtonDisabled={!this.props.isUpdate && this.state.step === 1 && !this.state.fields.service_id} onRequestSubmit={this.handleSubmit} secondaryButtonText="Cancel" />
                    </ComposedModal>

                </div>
            </div>
        );
    }
}

export default ServiceModal;