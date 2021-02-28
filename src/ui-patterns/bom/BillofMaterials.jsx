import React, { Component } from "react";
import Header from "../ui-shell/Header";
import 'carbon-components/css/carbon-components.min.css';
import * as _ from 'lodash';
import * as truncate from "truncate-utf8-bytes";
import * as filenamify from "filenamify/filenamify";

import { Breadcrumb, BreadcrumbItem }  from 'carbon-components-react'

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
    OverflowMenu,OverflowMenuItem
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';

class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            archid: null,
            data: [],
            headersData: [
                /*{
                    key: 'id',
                    header: 'Id',
                },*/
                {
                    key: 'ibm_service',
                    header: 'IBM Service',
                },
                {
                    key: 'desc',
                    header: 'Description',
                },
                {
                    key: 'deployment_method',
                    header: 'Dep Method',
                },
                {
                    key: 'compatibility',
                    header: 'Compatibility',
                },
                /*{
                    key: 'catalog_link',
                    header: 'Catalog View',
                },
                {
                    key: 'documentation',
                    header: 'Documentation',
                },
                {
                    key: 'hippa_compliance',
                    header: 'Hippa Compliance',
                },
                {
                    key: 'remarks',
                    header: 'Remarks',
                },*/
                {
                    key: 'provision',
                    header: 'Provision',
                },
                {
                    key: 'automation',
                    header: 'Automation',
                },
                {
                    key: 'hybrid_option',
                    header: 'Hybrid Option',
                },
                {
                    key: 'arch_id',
                    header: 'Arch Id',
                },
                {
                    key: 'service_id',
                    header: 'Service Id',
                },
                {
                    key: 'availibity',
                    header: 'Availibity',
                }
            ],
            architecture: {}
        };

    }
    async componentDidMount() {
        console.log(JSON.stringify(this.props))

        const arch   = await this.props.archService.getArchitectureById(this.props.archId);
        const jsonData = await this.props.bomService.getBOM(this.props.archId);
        const bomDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"_id\":/g, "\"id\":"));

        this.setState({
            archid : this.props.archId,
            data: bomDetails,
            architecture: arch
        });
    }

    bcprops = () => ({
        noTrailingSlash: false,
        isCurrentPage: true,
        onClick: function (action) {
            console.log(action)
        },
    });


    sanitize(input, replacement) {

        var illegalRe = /[\/\?<>\\:\*\|"]/g;
        var controlRe = /[\x00-\x1f\x80-\x9f]/g;
        var reservedRe = /^\.+$/;
        var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
        var windowsTrailingRe = /[\. ]+$/;


        if (typeof input !== 'string') {
            throw new Error('Input must be string');
        }
        var sanitized = input
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement)
            .replace(windowsTrailingRe, replacement);
        return truncate(sanitized, 255);
    }


    breadCrumbs( title ) {

        return (
            <Breadcrumb {...this.bcprops}>
                <BreadcrumbItem>
                    <Link to="/architectures">Architectures</Link>
                </BreadcrumbItem>
                <BreadcrumbItem href="#">{title}</BreadcrumbItem>
            </Breadcrumb>
        )
    }

    downloadTerraform (archid, archname) {

        if (_.isNull(archid) ) {
           alert("Cannot Download Terraform at this time"); // FIx with a Notification
           return
        }


        // Create File name from Name of Architecture
        var filename = archname.replace(/[^a-z0-9_\-]/gi, '-').replace(/_{2,}/g, '_').toLowerCase()
        var url = "/automation/"+archid;
        filename = filename+"-automation.zip";
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

    viewDiagram(){
        alert("Download Terraform");
    }

    addService(){
        alert("Add Service");
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            nextProps.data.getArchitectureDetails().then(data => {
                this.setState({ data: nextProps.data });
            });
        }
    }

    render() {

        const data = this.state.data;
        const headers = this.state.headersData;
        const archid = this.state.archid;
        console.log(JSON.stringify(archid));

        let title = "";
        if (!_.isUndefined(this.state.architecture.name)) {
            title = this.state.architecture.name
        }

        return (
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
                    <DataTable rows={data} headers={headers}>
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
                                            <TableToolbarAction onClick={()=>this.downloadTerraform(archid,title)} >
                                                <Download /> Terraform
                                            </TableToolbarAction>

                                        </TableToolbarContent>
                                        <TableToolbarContent>

                                            <TableToolbarSearch onChange={onInputChange} tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0} />

                                            <TableToolbarMenu
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}>
                                                <TableToolbarAction onClick={()=>this.downloadTerraform(archid,title)}>
                                                    <Download /> Terraform
                                               </TableToolbarAction>
                                                <TableToolbarAction onClick={this.viewDiagram}>
                                                    <View/> Diagram
                                                </TableToolbarAction>
                                            </TableToolbarMenu>


                                            <Button
                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                size="small"
                                                kind="primary"
                                                onClick={this.addService}
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
                                                    <TableSelectRow {...getSelectionProps({ row })} />
                                                    {row.cells.map((cell) => (
                                                        <TableCell key={cell.id}>{cell.value}</TableCell>
                                                    ))}
                                                    <TableCell className="bx--table-column-menu">
                                                        <OverflowMenu light flipped>
                                                            <OverflowMenuItem>View Mapping</OverflowMenuItem>
                                                            <OverflowMenuItem>View Service</OverflowMenuItem>
                                                            <OverflowMenuItem>Delete</OverflowMenuItem>
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
            </div>
        );
    }
}


export default BillofMaterialsView;
