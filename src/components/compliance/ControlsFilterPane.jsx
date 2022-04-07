import React, { Component } from "react";
import {
    Accordion,
    AccordionItem,
    MultiSelect,
    Checkbox
} from 'carbon-components-react';
import {
    Close32 as Close
} from '@carbon/icons-react';
import SlidingPane from "react-sliding-pane";

import {
    controlFocusAreas,
    controlFamilies,
    nistFunctions,
    controlRiskRating,
    controlType1,
    controlType2,
    controlType3,
    controlIbmResp,
    controlDevResp,
    controlOperatorResp,
    controlConsumerResp
} from '../../data/data';


class ControlsFilterPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: this.props.selectedFilters,
            accordionOpen: {
                general: true,
                family: false,
                type: false,
                risk: false,
                resp: false,
            }
        };
        this.handleCheck = this.handleCheck.bind(this);
    }

    handleCheck = async (attr, val, check) => {
        const item = {
            attr: attr,
            label: val,
            val: val
        };
        const selectedItems = this.state.selectedItems.filter((elt) => {return !(elt.attr === attr && elt.val === val)});
        if (check) selectedItems.push(item);
        await this.setState({
            selectedItems: selectedItems
        });
        console.log(this.state.selectedItems);
        this.props.filterTable({selectedItems: this.state.selectedItems});
    }

    render () {
        return (
            <SlidingPane
                className="sliding-pane"
                isOpen={this.props.open}
                width="500px"
                title="Filters"
                onRequestClose={this.props.onRequestClose}
                closeIcon={<Close style={{width: '32px'}}/>}
            >
                {
                    <div>
                        <Accordion>
                            <AccordionItem title="General" 
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, general: !this.state.accordionOpen.general}})}
                                open={this.state.accordionOpen.general}>
                                <Checkbox
                                    id='controls-and-operator'
                                    labelText='Use AND operator'
                                    onChange={(value, id, event) => this.handleCheck('and', 1, value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'and' && elt.val === 1)}  />
                                <Checkbox
                                    id='controls-base-control'
                                    labelText='Base Controls'
                                    onChange={(value, id, event) => this.handleCheck('base_control', true, value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'base_control' && elt.val)}  />
                                <Checkbox
                                    id='controls-scc'
                                    labelText='Security and Compliance Center'
                                    onChange={(value, id, event) => this.handleCheck('scc', 'Y', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'scc' && elt.val)}  />
                            </AccordionItem>
                            <AccordionItem title="Category" 
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, family: !this.state.accordionOpen.family}})}
                                open={this.state.accordionOpen.family}>
                                <MultiSelect.Filterable
                                    id='focus-areas'
                                    items={controlFocusAreas}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'focus_area');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'focus_area')}
                                    placeholder='Focus Area'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='control-families'
                                    items={controlFamilies}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'family');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'family')}
                                    placeholder='Control Family'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Type" 
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, type: !this.state.accordionOpen.type}})}
                                open={this.state.accordionOpen.type}>
                                <MultiSelect.Filterable
                                    id='control-type-3'
                                    items={controlType3}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'control_type_3');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'control_type_3')}
                                    placeholder='Manual / Automated'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='control-type-1'
                                    items={controlType1}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'control_type_1');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'control_type_1')}
                                    placeholder='Preventative / Detective / Corrective'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='control-type-2'
                                    items={controlType2}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'control_type_2');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'control_type_2')}
                                    placeholder='Administrative / Physical / Technical'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='nist-functions'
                                    items={nistFunctions}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'nist_functions');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'nist_functions')}
                                    placeholder='NIST Functions'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Risk" 
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, risk: !this.state.accordionOpen.risk}})}
                                open={this.state.accordionOpen.risk}>
                                <MultiSelect.Filterable
                                    id='control-risk-rating'
                                    items={controlRiskRating}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'risk_rating');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'risk_rating')}
                                    placeholder='Risk Rating'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Responsibility" 
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, resp: !this.state.accordionOpen.resp}})}
                                open={this.state.accordionOpen.resp}>
                                <MultiSelect.Filterable
                                    id='ibm-public-cloud-resp'
                                    items={controlIbmResp}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'ibm_public_cloud_resp');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'ibm_public_cloud_resp')}
                                    placeholder='IBM Cloud'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='developer-resp'
                                    items={controlDevResp}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'developer_resp');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'developer_resp')}
                                    placeholder='Developer'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='operator-resp'
                                    items={controlOperatorResp}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'operator_resp');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'operator_resp')}
                                    placeholder='Operator'
                                    size='sm'
                                />
                                <div style={{marginBottom: '0.5rem'}}></div>
                                <MultiSelect.Filterable
                                    id='consumer-resp'
                                    items={controlConsumerResp}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'consumer_resp');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'consumer_resp')}
                                    placeholder='Consumer'
                                    size='sm'
                                />
                            </AccordionItem>
                        </Accordion>
                    </div>
                }
            </SlidingPane>
        )
    }
}
export default ControlsFilterPane;