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
    Launch16
} from '@carbon/icons-react';
import {
    Link
} from "react-router-dom";

import { controlFrequencies, controlFamilies } from '../data/data';

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

class ControlsFilterPane extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: this.props.selectedFilters
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
                onRequestClose={this.props.onRequestClose}
                hideHeader
            >
                {
                    <div>
                        <h4>
                            Filters
                        </h4>
                        <br/>
                        <Accordion>
                            <AccordionItem title="General" open>
                                <Checkbox
                                    id='controls-show-items'
                                    labelText='Show Control Items'
                                    onChange={(value, id, event) => this.handleCheck('control_item', undefined, value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'control_item' && elt.val === undefined)}  />
                            </AccordionItem>
                            <AccordionItem title="Control Family" open={this.props.selectedFilters.find((elt) => elt.attr === 'family')}>
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
                                    placeholder='Control Families'
                                    size='sm'
                                />
                                {/* {ctrlsFamilies.map((family, ix) => (
                                    <Checkbox
                                        id={`control-family-${ix}`}
                                        labelText={family.label}
                                        onChange={(value, id, event) => console.log({value, id, event})}
                                    />
                                ))} */}
                            </AccordionItem>
                            <AccordionItem title="Control Type" open={this.props.selectedFilters.find((elt) => elt.attr === 'human_or_automated')}>
                                <Checkbox
                                    id='control-type-human'
                                    labelText='Human'
                                    onChange={(value, id, event) => this.handleCheck('human_or_automated', 'Human', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'human_or_automated' && elt.val === 'Human')} />
                                <Checkbox
                                    id='control-type-auto'
                                    labelText='Automated'
                                    onChange={(value, id, event) => this.handleCheck('human_or_automated', 'Automated', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'human_or_automated' && elt.val === 'Automated')} />
                                <Checkbox
                                    id='control-type-mix'
                                    labelText='Partly Both'
                                    onChange={(value, id, event) => this.handleCheck('human_or_automated', 'Mix', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'human_or_automated' && elt.val === 'Mix')} />
                                <Checkbox
                                    id='control-type-unknown'
                                    labelText='Unknown'
                                    onChange={(value, id, event) => this.handleCheck('human_or_automated', 'Unknown', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'human_or_automated' && elt.val === 'Unknown')} />
                            </AccordionItem>
                            <AccordionItem title="Control Frequency" open={this.props.selectedFilters.find((elt) => elt.attr === 'frequency')}>
                                <MultiSelect.Filterable
                                    id='control-frequencies'
                                    items={controlFrequencies}
                                    onChange={async (event) => {
                                        const selectedItems = this.state.selectedItems.filter((elt) => elt.attr !== 'frequency');
                                        event.selectedItems.forEach(item => selectedItems.push(item));
                                        await this.setState({selectedItems: selectedItems});
                                        this.props.filterTable({selectedItems: this.state.selectedItems});
                                    }}
                                    initialSelectedItems={this.props.selectedFilters.filter((elt) => elt.attr === 'frequency')}
                                    placeholder='Control Frequencies'
                                    size='sm'
                                />
                            </AccordionItem>
                            <AccordionItem title="Parameters" open={this.props.selectedFilters.find((elt) => elt.attr === 'org_defined_parameter')}>
                                <Checkbox
                                    id='control-org-defined-params'
                                    labelText='Organization Defined'
                                    onChange={(value, id, event) => this.handleCheck('org_defined_parameter', 'Yes', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'org_defined_parameter' && elt.val === 'Yes')} />
                                <Checkbox
                                    id='control-org-defined-params-mix'
                                    labelText='Partly Organization Defined'
                                    onChange={(value, id, event) => this.handleCheck('org_defined_parameter', 'Mix', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'org_defined_parameter' && elt.val === 'Mix')} />
                                <Checkbox
                                    id='control-not-org-defined-params'
                                    labelText='Other'
                                    onChange={(value, id, event) => this.handleCheck('org_defined_parameter', 'No', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'org_defined_parameter' && elt.val === 'No')} />
                            </AccordionItem>
                            <AccordionItem title="Security and Compliance" open={this.props.selectedFilters.find((elt) => elt.attr === 'existing_scc_goals')}>
                                <Checkbox
                                    id='control-scc-goals'
                                    labelText='Existing SCC Goals'
                                    onChange={(value, id, event) => this.handleCheck('existing_scc_goals', 'Yes', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'existing_scc_goals' && elt.val === 'Yes')} />
                                <Checkbox
                                    id='control-scc-goals-mix'
                                    labelText='Partly Existing SCC Goals'
                                    onChange={(value, id, event) => this.handleCheck('existing_scc_goals', 'Mix', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'existing_scc_goals' && elt.val === 'Mix')} />
                                <Checkbox
                                    id='control-no-scc-goals'
                                    labelText='No Existing SCC Goals'
                                    onChange={(value, id, event) => this.handleCheck('existing_scc_goals', 'No', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'existing_scc_goals' && elt.val === 'No')} />
                            </AccordionItem>
                            <AccordionItem title="Evindencing" open={this.props.selectedFilters.find((elt) => elt.attr === 'create_document')}>
                                <Checkbox
                                    id='control-require-doc'
                                    labelText='Require Document'
                                    onChange={(value, id, event) => this.handleCheck('create_document', 'Yes', value)} 
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'create_document' && elt.val === 'Yes')}/>
                                <Checkbox
                                    id='control-require-doc-mix'
                                    labelText='Partly Require Document'
                                    onChange={(value, id, event) => this.handleCheck('create_document', 'Mix', value)} 
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'create_document' && elt.val === 'Mix')}/>
                                <Checkbox
                                    id='control-no-require-doc'
                                    labelText="Don't Require Document"
                                    onChange={(value, id, event) => this.handleCheck('create_document', 'No', value)}
                                    defaultChecked={this.props.selectedFilters.find((elt) => elt.attr === 'create_document' && elt.val === 'No')}/>
                            </AccordionItem>
                        </Accordion>
                    </div>
                }
            </SlidingPane>
        )
    }
}
export default ControlsFilterPane;