import React, { Component } from "react";
import {
    DataTableSkeleton,
    Pagination
} from 'carbon-components-react';
import ControlsFilterPane from './ControlsFilterPane';
import ControlsTable from './ControlsTable';
import { ctrlsHeaders } from '../data/data';


class ControlsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterData: [],
            headerData: ctrlsHeaders,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 15,
            searchValue: '',
            selectedFilters: [],
            isPaneOpen: false
        };
        this.filterTable = this.filterTable.bind(this);
        this.openFilterPane = this.openFilterPane.bind(this);
        this.hideFilterPane = this.hideFilterPane.bind(this);
    }

    async componentDidMount() {
        const jsonData = await this.props.controls.getControls();
        const filterData = jsonData.filter(elt => elt.control_item === false);
        console.log(filterData)
        this.setState({
            data: jsonData,
            filterData: filterData,
            totalItems: filterData.length
        });
    }

    async filterTable(event) {
        const searchValue = event?.target ? event?.target?.value : this.state.searchValue;
        let selFilters = event.hasOwnProperty('selectedItems') ? event?.selectedItems: this.state.selectedFilters;
        let filterIsOr = selFilters.find(elt => elt.attr === 'and') === undefined;
        let filterData;
        if (selFilters.find(elt => elt.attr === 'control_item')) filterData = this.state.data;
        else filterData = this.state.data.filter(elt => !elt?.control_item);
        const selectedFilters = selFilters.filter(elt => elt.attr !== 'control_item' && elt.attr !== 'and');
        if (event?.target || searchValue) {
            filterData = filterData.filter(elt => elt?.id?.includes(searchValue) || elt?.name?.includes(searchValue) || elt?.family?.includes(searchValue) || elt?.controlDetails?.focus_area?.includes(searchValue));
        }
        if (selectedFilters.length) {
            filterData = filterData.filter(elt => {
                let metFilters = 0;
                for (const item of selectedFilters) {
                    if (
                        (
                            [
                                'scc',
                                'control_type_1',
                                'control_type_2',
                                'control_type_3',
                                'risk_rating',
                            ].includes(item.attr) && elt?.controlDetails?.requirements?.find(req => req[item.attr] === item.val) ||
                            [
                                'ibm_public_cloud_resp',
                                'developer_resp',
                                'operator_resp',
                                'consumer_resp'
                            ].includes(item.attr) && elt?.controlDetails?.requirements?.find(req => req[item.attr]?.includes(item.val)) ||
                            item.attr === 'nist_functions' && elt?.controlDetails[item.attr]?.includes(item.val) ||
                            item.attr === 'focus_area' && elt?.controlDetails[item.attr] === item.val ||
                            elt[item.attr] === item.val
                        ) 
                        && (filterIsOr || ++metFilters === selectedFilters.length)
                    ) return true;
                }
                return false;
            });
        }
        this.setState({
            filterData: filterData,
            firstRowIndex: 0,
            totalItems: filterData.length,
            searchValue: searchValue,
            selectedFilters: selFilters
        });
    }

    openFilterPane = () => {
        this.setState({
            isFilterPaneOpen: true
        });
    };

    hideFilterPane = () => {
        this.setState({ isFilterPaneOpen: false });
    };

    render() {
        const data = this.state.filterData;
        for (let index = 0; index < data.length; index++) {
            let row = data[index];
            row.family = row?.family || row?.nist?.family
            row.focus_area = row?.focus_area || row?.controlDetails?.focus_area
        } 
        const headers = this.state.headerData;
        let table;
        if (this.state.data.length === 0) {
            table = <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={15}
                showHeader={false}
                headers={null}
            />
        } else {
            table = <>
                <ControlsTable
                    headers={headers}
                    rows={data.slice(
                        this.state.firstRowIndex,
                        this.state.firstRowIndex + this.state.currentPageSize
                    )}
                    filter={this.filterTable}
                    onClickFilter={this.openFilterPane}
                />
                <Pagination
                    totalItems={this.state.totalItems}
                    backwardText="Previous page"
                    forwardText="Next page"
                    pageSize={this.state.currentPageSize}
                    pageSizes={[5, 10, 15, 25]}
                    itemsPerPageText="Items per page"
                    onChange={({ page, pageSize }) => {
                        if (pageSize !== this.state.currentPageSize) {
                            this.setState({
                                currentPageSize: pageSize
                            });
                        }
                        this.setState({
                            firstRowIndex: pageSize * (page - 1)
                        });
                    }}
                />
            </>
        }
        return (
            <>
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col-lg-12">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Controls
                        </h2>
                        <br></br>
                        <p>
                            List of FS Cloud controls
                        </p>
                        <br></br>
                    </div>
                </div>
                
                <div className="bx--row">
                    <div className="bx--col-lg-12">
                        {table}
                    </div>
                </div>
            </div >
            <div>
                <ControlsFilterPane
                    open={this.state.isFilterPaneOpen}
                    onRequestClose={this.hideFilterPane}
                    filterTable={this.filterTable}
                    selectedFilters={this.state.selectedFilters}/>
            </div>
            </>
        );
    }
}
export default ControlsView;