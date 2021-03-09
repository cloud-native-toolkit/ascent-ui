import React, { Component } from "react";
import Header from "../ui-shell/Header";

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete
} from '@carbon/icons-react';
import {
    DataTable, DataTableSkeleton, TableContainer, Table,
    TableToolbar, TableToolbarMenu, OverflowMenu, OverflowMenuItem, TableSelectAll, TableSelectRow, TableBatchActions, TableBatchAction, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { serviceHeader } from '../data/data';
import FormModal from './AddDataModal';



class ServiceDataView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            headerData: serviceHeader,
            show: false,
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10,
            isUpdate: false,
            serviceRecord: []
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

    }
    async componentDidMount() {
        const jsonData = await this.props.service.getServices();
        const serviceDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"service_id\":/g, "\"id\":"));
        this.setState({
            data: serviceDetails,
            totalItems: serviceDetails.length
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            nextProps.data.getArchitectureDetails().then(data => {
                this.setState({
                    data: nextProps.data,
                    totalItems: nextProps.data.length
                });
            });
        }
    }
    doGetServiceDetails(service_id) {
        console.log(service_id);
    }
    batchActionClick(rows) {
        console.log(this.state.data);
        let i = 0;
        rows.forEach(data => {
            this.props.service.doDeleteService(data.id).then(res => {
                let service_details = this.state.data.filter(details => details.id !== data.id);
                this.setState({
                    data: service_details,
                    totalItems: this.state.data.length
                });
                i++;
            });
        });
    }
    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.props.service.getServices().then(response => {
            let serviceDetails = JSON.parse(JSON.stringify(response).replace(/\"service_id\":/g, "\"id\":"));
            console.log(serviceDetails);
            this.setState({
                data: serviceDetails,
                show: false
            });
        })

    };
    doUpdateService(index) {
        this.setState({
            show: true,
            isUpdate: true,
            serviceRecord: this.state.data[index]
        });

    }

    render() {
        let data = this.state.data;
        let headers = this.state.headerData;
        let showModal = this.state.show;
        let table;
        if (data.length === 0) {
            table = <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={10}
                headers={headers}
            />
        } else {
            table = <>
                        <DataTable rows={data.slice(
                            this.state.firstRowIndex,
                            this.state.firstRowIndex + this.state.currentPageSize
                        )} headers={headers}>
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

                                            </TableBatchActions>
                                            <TableToolbarContent>

                                                <TableToolbarSearch onChange={onInputChange} />
                                                <TableToolbarMenu>
                                                    <TableToolbarAction>
                                                        Action 1
                                                    </TableToolbarAction>
                                                    <TableToolbarAction>
                                                        Action 2
                                                    </TableToolbarAction>
                                                    <TableToolbarAction>
                                                        Action 3
                                                    </TableToolbarAction>
                                                </TableToolbarMenu>
                                                <Button
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                    size="small"
                                                    kind="primary"
                                                    onClick={this.showModal}>Add</Button>
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
                                                    <TableHeader />
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row, i) => (
                                                    <TableRow key={row.id} {...getRowProps({ row })}>
                                                        <TableSelectRow {...getSelectionProps({ row })} />
                                                        {row.cells.map((cell) => (
                                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                                        ))}
                                                        <TableCell className="bx--table-column-menu">
                                                            <OverflowMenu light flipped>
                                                                <OverflowMenuItem itemText="Edit" onClick={() => this.doUpdateService(i)} />
                                                            </OverflowMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                        </DataTable>
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

            <><div>
                {showModal &&
                    <FormModal show={this.state.show} handleClose={this.hideModal} service={this.props.service} isUpdate={this.state.isUpdate} data={this.state.serviceRecord} />
                }
            </div>
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
                        <div className="bx--col-lg-16">
                            {table}
                        </div>
                    </div>
                </div></>
        );

    }
}
export default ServiceDataView;