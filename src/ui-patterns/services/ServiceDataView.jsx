import React, { Component, useState } from "react";
import Header from "../ui-shell/Header";

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View
} from '@carbon/icons-react';
import {
    DataTable, TableContainer, Table,
    TableToolbar, TableToolbarMenu, Modal, SelectItem, TextInput, Select, OverflowMenu, OverflowMenuItem, TableSelectAll, TableSelectRow, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { headerData } from './headerData';
import FormModal from './AddDataModal';


class ServiceDataView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            headerData: headerData
        };

    }
    async componentDidMount() {
        const jsonData = await this.props.service.getServices();
        const serviceDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"service_id\":/g, "\"id\":"));
        this.setState({
            data: serviceDetails
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            nextProps.data.getArchitectureDetails().then(data => {
                this.setState({ data: nextProps.data });
            });
        }
    }
    doGetServiceDetails(service_id) {
        console.log(service_id);
    }
    batchActionClick(rows) {
        let i = 0;
        rows.forEach(data => {
            const jsonData = this.props.service.doDeleteService(data.id);
            this.state.data.splice(i, 1);
            console.log(jsonData);
            i++;
        });

        this.setState({
            data: this.state.data
        });
    }
    doOpenForm() {

    }
    render() {
        const data = this.state.data;
        const headers = this.state.headerData;
        return (
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--col-lg-16">
                        <br></br>
                        <h2 className="landing-page__subheading">
                            Services
                        </h2>
                        <br></br>
                        <p>
                            List of IBM Cloud services
                        </p>
                        <br></br>
                    </div>
                </div>

                <div className="bx--row">

                    <DataTable rows={data} headers={headers}>
                        {({
                            rows,
                            headers,
                            getHeaderProps,
                            getSelectionProps,
                            getToolbarProps,
                            getBatchActionProps,
                            getRowProps,
                            getTableProps,
                            selectedRows,
                            onInputChange

                        }) => (
                                <TableContainer>
                                    <TableToolbar>
                                        <TableBatchActions {...getBatchActionProps()}>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Delete}
                                                onClick={() => this.batchActionClick(selectedRows)}>
                                                Delete
                                            </TableBatchAction>
                                            {/*<TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Save}
                                                onClick={batchActionClick(selectedRows)}>
                                                Save
                                            </TableBatchAction>
                                            <TableBatchAction
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                renderIcon={Download}
                                                onClick={batchActionClick(selectedRows)}>
                                                Download
                                            </TableBatchAction>*/}
                                        </TableBatchActions>
                                        <TableToolbarContent>
                                            {/* pass in `onInputChange` change here to make filtering work */}
                                            <TableToolbarSearch onChange={onInputChange} />
                                            <TableToolbarMenu>
                                                <TableToolbarAction >
                                                    Action 1
                                        </TableToolbarAction>
                                                <TableToolbarAction>
                                                    Action 2
                                        </TableToolbarAction>
                                                <TableToolbarAction >
                                                    Action 3
                                        </TableToolbarAction>
                                            </TableToolbarMenu>
                                            <Button onClick={() => this.doOpenForm()} >Add</Button>
                                        </TableToolbarContent>
                                    </TableToolbar>
                                    <Table {...getTableProps()}>
                                        <TableHead>
                                            <TableRow>
                                                <TableSelectAll {...getSelectionProps()} />
                                                {headers.map((header) => (
                                                    <TableHeader key={header.key} {...getHeaderProps({ header })}>
                                                        {header.header}
                                                    </TableHeader>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.id} {...getRowProps({ row })}>
                                                    <TableSelectRow {...getSelectionProps({ row })} />
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                    <TableCell className="bx--table-column-menu">
                                                        <OverflowMenu light flipped >
                                                            <OverflowMenuItem itemText="Edit" />
                                                        </OverflowMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                    </DataTable>
                    <div style={{ width: '800px' }}>
                        <Pagination
                            backwardText="Previous page"
                            forwardText="Next page"
                            itemsPerPageText="Items per page:"
                            page={1}
                            pageNumberText="Page Number"
                            pageSize={10}
                            pageSizes={[
                                10,
                                20,
                                30,
                                40,
                                50
                            ]}
                            totalItems={103}
                        />
                    </div>
                </div>
            </div >
        );

    }
}
export default ServiceDataView;