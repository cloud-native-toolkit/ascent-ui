import React, { Component } from "react";
import {
    DataTableSkeleton,
    Pagination
} from 'carbon-components-react';
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
            currentPageSize: 10
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

    async filterTable(searchValue) {
        if (searchValue) {
            const filterData = this.state.data.filter(elt => elt.id.includes(searchValue) || elt.name.includes(searchValue) || elt?.nist?.family.includes(searchValue));
            this.setState({
                filterData: filterData,
                firstRowIndex: 0,
                totalItems: filterData.length
            });
        } else {
            this.setState({
                filterData: this.state.data,
                firstRowIndex: 0,
                totalItems: this.state.data.length
            });
        }
    }
    render() {
        const data = this.state.filterData;
        for (let index = 0; index < data.length; index++) {
            let row = data[index];
            row.family = row?.nist?.family
        } 
        const headers = this.state.headerData;
        let table;
        if (this.state.data.length === 0) {
            table = <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={10}
                headers={headers}
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