import React, { Component } from "react";
import {
    UnorderedList, ListItem, BreadcrumbSkeleton, SearchSkeleton, Tag, 
    CodeSnippet,
    Accordion,
    AccordionItem,
    MultiSelect,
    Checkbox
} from 'carbon-components-react';
import {
    WarningAlt16,
    Launch16,
    Close32 as Close
} from '@carbon/icons-react';
import {
    Link
} from "react-router-dom";

import { servicePlatforms, serviceGroupings, serviceDeploymentMethods, serviceProvisionMethods } from '../data/data';

import SlidingPane from "react-sliding-pane";

class ServiceFilterPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: this.props.selectedFilters,
            accordionOpen: {
                general: true,
                platform: false,
                grouping: false,
                deployment: false,
                provision: false,
            },
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
                            </AccordionItem>
                            <AccordionItem
                                title="Supported Platforms"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, platform: !this.state.accordionOpen.platform}})}
                                open={this.state.accordionOpen.platform}>
                                <MultiSelect.Filterable
                                    id='supported-platforms'
                                    items={servicePlatforms}
                                    sortItems={(arr) => arr}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'supported_platforms');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'supported_platforms')}
                                    placeholder='Platform'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Grouping"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, grouping: !this.state.accordionOpen.grouping}})}
                                open={this.state.accordionOpen.grouping}>
                                <MultiSelect.Filterable
                                    id='service-groupings'
                                    items={serviceGroupings}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'grouping');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'grouping')}
                                    placeholder='Service Grouping'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Deployment Method"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, deployment: !this.state.accordionOpen.deployment}})}
                                open={this.state.accordionOpen.deployment}>
                                <MultiSelect.Filterable
                                    id='service-deployment-methods'
                                    items={serviceDeploymentMethods}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'deployment_method');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'deployment_method')}
                                    placeholder='Deployment Method'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Provisionning"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, provision: !this.state.accordionOpen.provision}})}
                                open={this.state.accordionOpen.provision}>
                                <MultiSelect.Filterable
                                    id='service-provision-methods'
                                    items={serviceProvisionMethods}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'provision');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'provision')}
                                    placeholder='Provisionning'
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
export default ServiceFilterPane;