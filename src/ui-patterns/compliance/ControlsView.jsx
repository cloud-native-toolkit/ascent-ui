import React, { Component } from "react";
import {
    DataTableSkeleton,
    Pagination
} from 'carbon-components-react';
import ControlsTable from './ControlsTable';
import { ctrlsHeaders, ctrlsfFilterItems } from '../data/data';


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
            selectedFilters: []
        };
        this.filterTable = this.filterTable.bind(this);
    }

    async componentDidMount() {
        const jsonData = await this.props.controls.getControls();
        this.setState({
            data: jsonData,
            filterData: jsonData,
            totalItems: jsonData.length
        });
    }

    async filterTable(event) {
        const searchValue = event?.target ? event?.target?.value : this.state.searchValue;
        let selectedFilters = event.hasOwnProperty('selectedItems') ? event?.selectedItems: this.state.selectedFilters;
        let filterIsOr = selectedFilters.find(elt => elt.label === 'AND') === undefined;
        selectedFilters = selectedFilters.filter(elt => elt.label !== 'AND');
        let filterData = this.state.data;
        if (event?.target || searchValue) {
            filterData = this.state.data.filter(elt => elt?.id?.includes(searchValue) || elt?.name?.includes(searchValue) || elt?.nist?.family?.includes(searchValue));
        }
        if (selectedFilters.length) {
            console.log(selectedFilters)
            filterData = filterData.filter(elt => {
                let metFilters = 0;
                for (const item of selectedFilters) {
                    if (elt[item.attr] === item.val && (filterIsOr || ++metFilters === selectedFilters.length)) return true;
                }
                return false;
            });
        }
        this.setState({
            filterData: filterData,
            firstRowIndex: 0,
            totalItems: filterData.length,
            searchValue: searchValue,
            selectedFilters: selectedFilters
        });
    }

    render() {
        const data = this.state.filterData;
        for (let index = 0; index < data.length; index++) {
            let row = data[index];
            row.family = row?.family || row?.nist?.family
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
                    filterItems={ctrlsfFilterItems}
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
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col-lg-16">
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
                    <div className="bx--col-lg-16">
                        {table}
                    </div>
                </div>
            </div >
        );

    }
}
export default ControlsView;