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

import { servicePlatforms, serviceProviders } from '../data/data';

import SlidingPane from "react-sliding-pane";

class ServiceFilterPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: this.props.selectedFilters,
            accordionOpen: {
                general: true,
                platform: false,
                provider: false,
                tags: false,
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
                                title="Platform"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, platform: !this.state.accordionOpen.platform}})}
                                open={this.state.accordionOpen.platform}>
                                <MultiSelect.Filterable
                                    id='supported-platforms'
                                    items={servicePlatforms}
                                    sortItems={(arr) => arr}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'platform');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'platform')}
                                    placeholder='Platform'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Grouping"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, provider: !this.state.accordionOpen.provider}})}
                                open={this.state.accordionOpen.provider}>
                                <MultiSelect.Filterable
                                    id='service-providers'
                                    items={serviceProviders}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'provider');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'provider')}
                                    placeholder='Service Provider'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Tags"
                                onClick={() => this.setState({accordionOpen: {...this.state.accordionOpen, tags: !this.state.accordionOpen.tags}})}
                                open={this.state.accordionOpen.tags}>
                                <MultiSelect.Filterable
                                    id='service-tags'
                                    items={this.props.tags}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'tags');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable(this.state);
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'tags')}
                                    placeholder='Tag'
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