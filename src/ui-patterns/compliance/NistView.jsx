import React, { Component } from "react";
import {
    DataTableSkeleton,
    Pagination
} from 'carbon-components-react';
import NistTable from './NistTable';
import { nistHeaders } from '../data/data';


class NistView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterData: [],
            headerData: nistHeaders,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 15
        };
        this.filterTable = this.filterTable.bind(this);
    }

    async componentDidMount() {
        const jsonData = await this.props.nist.getNist();
        const nistDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"number\":/g, "\"id\":"));
        this.setState({
            data: nistDetails,
            filterData: nistDetails,
            totalItems: nistDetails.length
        });
    }

    async filterTable(searchValue) {
        if (searchValue) {
            const filterData = this.state.data.filter(elt => elt?.id?.includes(searchValue) || elt?.title?.includes(searchValue) || elt?.family?.includes(searchValue));
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
                <NistTable
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
                    <div className="bx--col-lg-12">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            NIST
                        </h2>
                        <br></br>
                        <p>
                            List of NIST 800-53 controls 
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
        );

    }
}
export default NistView;