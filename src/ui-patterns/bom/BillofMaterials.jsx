import React, { Component } from "react";
import Header from "../ui-shell/Header";
import 'carbon-components/css/carbon-components.min.css';
import * as _ from 'lodash';
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import SlidingPane from "react-sliding-pane";
import ServiceModal from './AddServiceModal';

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
    DataTable, TableContainer, Table, TableSelectAll, TableBatchAction, TableSelectRow,
    TableBatchActions, TableToolbar, TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction,
    OverflowMenu, OverflowMenuItem
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { bomHeader } from '../data/data';

class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            archid: null,
            data: [],
            headersData: bomHeader,
            show: false,
            isUpdate: false,
            serviceRecord: [],
            architecture: {},
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);

    }
    async componentDidMount() {
        const arch = await this.props.archService.getArchitectureById(this.props.archId);
        const jsonData = await this.props.bomService.getBOM(this.props.archId);
        const bomDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"_id\":/g, "\"id\":"));
        let service_list = await this.props.bomService.getServices();


        this.setState({
            archid: this.props.archId,
            data: bomDetails,
            architecture: arch,
            totalItems: bomDetails.length,
            serviceNames: service_list
        });
    }

    bcprops = () => ({
        noTrailingSlash: false,
        isCurrentPage: true,
        onClick: function (action) {
            console.log(action)
        },
    });


    breadCrumbs(title) {

        return (
            <Breadcrumb {...this.bcprops}>
                <BreadcrumbItem>
                    <Link to="/architectures">Architectures</Link>
                </BreadcrumbItem>
                <BreadcrumbItem href="#">{title}</BreadcrumbItem>
            </Breadcrumb>
        )
    }

    downloadTerraform(archid, archname) {

        if (_.isNull(archid)) {
            alert("Cannot Download Terraform at this time"); // FIx with a Notification
            return
        }

        // Create File name from Name of Architecture
        var filename = archname.replace(/[^a-z0-9_\-]/gi, '-').replace(/_{2,}/g, '_').toLowerCase()
        var url = "/automation/" + archid;
        filename = filename + "-automation.zip";
        fetch(url)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                });
            });
    }

    viewDiagram() {
        alert("Download Terraform");
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

    // API issues there So need to work on this function
    batchActionClick(rows) {
        console.log(this.state.data);
        let i = 0;
        rows.forEach(data => {
            this.props.bomService.doDeleteBOM(data.id).then(res => {
                let service_details = this.state.data.filter(details => details.id !== data.id);
                this.setState({
                    data: service_details,
                    totalItems: this.state.data.length
                });
                i++;
            });
        });
    }

    /*********Modal From Code Start*****************/

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.props.bomService.getBOM(this.props.archId).then(response => {
            let serviceDetails = JSON.parse(JSON.stringify(response).replace(/\"_id\":/g, "\"id\":"));
            this.setState({
                data: serviceDetails,
                show: false
            });
        })

    };
    doUpdateService(index) {
        console.log(this.state.data[index]);
        this.setState({
            show: true,
            isUpdate: true,
            serviceRecord: this.state.data[index]
        });

    }

    /********Modal Form Code END*******************/
    render() {

        const data = this.state.data;
        const headers = this.state.headersData;
        const archid = this.state.archid;
        let title = "";
        if (!_.isUndefined(this.state.architecture.name)) {
            title = this.state.architecture.name
        }
        let showModal = this.state.show;

        return (
            <><div>
                {showModal &&
                    <ServiceModal archId={archid} show={this.state.show} handleClose={this.hideModal} service={this.props.bomService} isUpdate={this.state.isUpdate} data={this.state.serviceRecord} services={this.state.serviceNames} />}
            </div>
                <div className="bx--grid">
                    {this.breadCrumbs(title)}
                    <div className="bx--row">
                        <div className="bx--col-lg-16">
                            <br></br>
                            <h2 className="landing-page__subheading">
                                Bill Of Materials
                            </h2>
                            <br></br>
                            <p>
                                List of IBM Cloud services that form the bill of materials for this reference architecture
                            </p>
                            <br></br>
                        </div>
                    </div>

                    <div className="bx--row">
                        <DataTable rows={data.slice(
                            this.state.firstRowIndex,
                            this.state.firstRowIndex + this.state.currentPageSize
                        )} headers={headers}>
                            {({
                                rows,
                                headers,
                                getHeaderProps,
                                getRowProps,
                                getSelectionProps,
                                getToolbarProps,
                                getBatchActionProps,
                                onInputChange,
                                selectedRows,
                                getTableProps,
                                getTableContainerProps,
                            }) => (
                                    <TableContainer
                                        {...getTableContainerProps()}>
                                        <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                                            <TableBatchActions {...getBatchActionProps()}>
                                                <TableBatchAction
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                    renderIcon={Delete}
                                                    onClick={() => this.batchActionClick(selectedRows)}
                                                >
                                                    Delete
                                                </TableBatchAction>
                                                <TableBatchAction
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                    renderIcon={Save}
                                                >
                                                    Save
                                                </TableBatchAction>
                                                <TableBatchAction
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                    renderIcon={Download}
                                                >
                                                    Download
                                                </TableBatchAction>
                                            </TableBatchActions>
                                            <TableToolbarContent>
                                                <TableToolbarAction onClick={() => this.downloadTerraform(archid, title)}>
                                                    <Download /> Terraform
                                                </TableToolbarAction>

                                            </TableToolbarContent>
                                            <TableToolbarContent>

                                                <TableToolbarSearch onChange={onInputChange} tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0} />

                                                <TableToolbarMenu
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}>
                                                    <TableToolbarAction onClick={() => this.downloadTerraform(archid, title)}>
                                                        <Download /> Terraform
                                                    </TableToolbarAction>
                                                    <TableToolbarAction onClick={this.viewDiagram}>
                                                        <View /> Diagram
                                                    </TableToolbarAction>
                                                </TableToolbarMenu>


                                                <Button
                                                    tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                    size="small"
                                                    kind="primary"
                                                    onClick={this.showModal}
                                                >
                                                    Add Service
                                                </Button>
                                            </TableToolbarContent>
                                        </TableToolbar>
                                        <Table {...getTableProps()}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableSelectAll {...getSelectionProps()} />
                                                    {headers.map((header, i) => (
                                                        <TableHeader key={i} {...getHeaderProps({ header })}>
                                                            {header.header}
                                                        </TableHeader>
                                                    ))}
                                                    <TableHeader />
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {rows.map((row, i) => (
                                                    <TableRow key={i} {...getRowProps({ row })}>
                                                        <TableSelectRow {...getSelectionProps({ row })} onClick={() => this.setState({ isPaneOpen: true, row: row })} />
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
                            }} />

                    </div>
                </div></>
        );
    }
}


/*
            <>
            <SlidingPane
                className="some-custom-class"
                overlayClassName="some-custom-overlay-class"
                isOpen={state.isPaneOpen}
                title="Hey, it is optional pane title.  I can be React component too."
                subtitle="Optional subtitle."
                onRequestClose={() => {
                    // triggered on "<" on left top click or on outside click
                    setState({ isPaneOpen: false });
                }}
            >
                <div>And I am pane content. BTW, what rocks?</div>
            </SlidingPane>
            </>

 */

export default BillofMaterialsView;
