import React, { Component } from "react";
import {
    Grid, Row, Column, DataTableSkeleton, Pagination
} from 'carbon-components-react';

import NistTable from './NistTable';
import { nistHeaders } from '../../data/data';
import { getNist } from "../../services/nist";

const b64 = require('../../utils/b64');

const ASCENT_NIST_CACHE = "ASCENT_NIST_CACHE";

class NistView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterData: [],
            headerData: nistHeaders,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 25
        };
        this.filterTable = this.filterTable.bind(this);
    }

    async getNistControls() {
        let nistDetails;
        try {
            const localData = sessionStorage.getItem(ASCENT_NIST_CACHE);
            nistDetails = JSON.parse(b64.decode(JSON.parse(localData)?.data));
        } catch (error) {
            let jsonData=[]
            try {
                jsonData = await getNist();
            } catch (error) {
                this.props.addNotification('error', 'Error', 'Error fetching NIST data.');
            }
            nistDetails = JSON.parse(JSON.stringify(jsonData).replace(/"number":/g, '"id":'));
            try {
                sessionStorage.setItem(
                    ASCENT_NIST_CACHE,
                    JSON.stringify({
                      data: b64.encode(JSON.stringify(nistDetails))
                    })
                )
            } catch (error) {
                console.log(error);
            }
        }
        
        this.setState({
            data: nistDetails,
            filterData: nistDetails,
            totalItems: nistDetails.length
        });
    }

    async componentDidMount() {
        this.getNistControls();
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
                rowCount={25}
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
            <Grid>
                <Row>
                    <Column lg={{span: 12}}>
                        <h2>NIST</h2>
                        <p>
                            List of NIST 800-53 controls 
                        </p>
                        <br></br>
                    </Column>
                </Row>
                <Row>
                    <Column lg={{span: 12}}>
                        {table}
                    </Column>
                </Row>
            </Grid>
        );

    }
}
export default NistView;
