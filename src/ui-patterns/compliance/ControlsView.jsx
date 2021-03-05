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
            headerData: ctrlsHeaders,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10
        };
    }

    async componentDidMount() {
        const jsonData = await this.props.controls.getControls();
        const controlsDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"control_id\":/g, "\"id\":"));
        this.setState({
            data: controlsDetails,
            totalItems: controlsDetails.length
        });
    }
    render() {
        const data = this.state.data;
        const headers = this.state.headerData;
        let table;
        if (data.length === 0) {
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