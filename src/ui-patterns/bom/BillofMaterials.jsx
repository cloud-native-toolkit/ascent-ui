import React, { Component } from "react";
import 'carbon-components/css/carbon-components.min.css';
import * as _ from 'lodash';
import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import ServiceModal from './AddServiceModal';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View,
    Add16,
    WarningAlt16,
    Launch16
} from '@carbon/icons-react';
import {
    UnorderedList, ListItem,
    BreadcrumbSkeleton, SearchSkeleton,
    ComposedModal, ModalHeader, ModalBody, Tag,
    DataTable, DataTableSkeleton, TableContainer, Table, TableSelectAll, TableBatchAction, TableSelectRow,
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
            showDiagram: false,
            isUpdate: false,
            serviceRecord: [],
            architecture: {},
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10,
            isPaneOpen: false,
            dataDetails: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showDiagram = this.showDiagram.bind(this);
        this.hideDiagram = this.hideDiagram.bind(this);
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
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

    openPane = async (bomId) => {
        if (bomId) {
            this.props.bomService.getBomDetails(bomId).then((jsonData) => {
                console.log(jsonData);
                this.setState({
                    dataDetails: jsonData
                });
            });
            this.setState({
                isPaneOpen: true
            });
        }
    };

    hidePane = () => {
        this.setState({ isPaneOpen: false, dataDetails: false });
    };

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

    /*********Modal From Code Start*****************/

    showDiagram = () => {
        this.setState({ showDiagram: true });
    };

    hideDiagram = () => {
        this.setState({ showDiagram: false });
    };
    render() {
        let data = this.state.data;
        for (let index = 0; index < data.length; index++) {
            let row = data[index];
            row.ibm_service = row.ibm_service || row.service_id;
        }
        const headers = this.state.headersData;
        const archid = this.state.archid;
        let title = "";
        if (!_.isUndefined(this.state.architecture.name)) {
            title = this.state.architecture.name
        }
        let showModal = this.state.show;
        let showDiagram = this.state.showDiagram;
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

                                    <TableToolbarMenu>
                                        <TableToolbarAction style={{ display: 'flex' }} onClick={this.showDiagram}>
                                            <div>Diagram</div>
                                            <View style={{ marginLeft: "auto" }} />
                                        </TableToolbarAction>
                                        <TableToolbarAction style={{ display: 'flex' }} href={'/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_drawio} download>
                                            <div style={{ flex: 'left' }}>Diagram .drawio</div>
                                            <Download style={{ marginLeft: "auto" }} />
                                        </TableToolbarAction>
                                    </TableToolbarMenu>


                                    <Button
                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                        size="small"
                                        kind="primary"
                                        renderIcon={Add16}
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
                                        <>
                                            <TableRow key={i} {...getRowProps({ row })} >
                                                <TableSelectRow {...getSelectionProps({ row })} />
                                                {row.cells.map((cell) => (
                                                    <TableCell key={cell.id} class="clickable" onClick={() => this.openPane(row.id)} >
                                                        {
                                                            cell.info && cell.info.header === "service_id"?
                                                            <Tag type="blue">
                                                                <Link to={"/services/" + cell.value} >
                                                                {cell.value}
                                                                </Link>
                                                            </Tag> 
                                                            :
                                                            cell.value
                                                        }
                                                    </TableCell>
                                                ))}
                                                <TableCell className="bx--table-column-menu">
                                                    <OverflowMenu light flipped>
                                                        <OverflowMenuItem itemText="Edit" onClick={() => this.doUpdateService(i)} />
                                                    </OverflowMenu>
                                                </TableCell>
                                            </TableRow>
                                        </>
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
            </>
        }

        return (
            <>
                <div>
                    {showModal &&
                        <ServiceModal archId={archid} show={this.state.show} handleClose={this.hideModal} service={this.props.bomService} isUpdate={this.state.isUpdate} data={this.state.serviceRecord} services={this.state.serviceNames} />}
                    {showDiagram &&
                        <ComposedModal
                            open={showDiagram}
                            onClose={this.hideDiagram}>
                            <ModalHeader title={this.state.architecture.name} />
                            <ModalBody><img src={'/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_png} alt="Reference Architecture diagram" /></ModalBody>
                        </ComposedModal>}
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
                        <div className="bx--col-lg-16">
                            {table}
                        </div>
                    </div>
                </div>
                <div>
                    <SlidingPane
                        className="sliding-pane"
                        isOpen={this.state.isPaneOpen}
                        width="500px"
                        onRequestClose={this.hidePane}
                        hideHeader
                    >
                        {
                            this.state.dataDetails ?
                                <div>
                                    <h3 style={{ display: 'flex' }}>
                                        {
                                            this.state.dataDetails.catalog && this.state.dataDetails.catalog.overview_ui && this.state.dataDetails.catalog.overview_ui.en ?
                                                this.state.dataDetails.catalog.overview_ui.en.display_name
                                            : this.state.dataDetails.service ?
                                                this.state.dataDetails.service.ibm_catalog_service || this.state.dataDetails.service.service_id
                                            :
                                                this.state.dataDetails.ibm_service || this.state.dataDetails.service_id
                                        }
                                        {this.state.dataDetails.catalog && this.state.dataDetails.catalog.tags && this.state.dataDetails.catalog.tags.length > 0 && this.state.dataDetails.catalog.tags.includes("fs_ready") && <Tag type="green" style={{ marginLeft: "auto" }}>FS Ready</Tag>}
                                    </h3>
                                    <br />
                                    <p>
                                        <strong>Description: </strong>
                                        {
                                            this.state.dataDetails.catalog && this.state.dataDetails.catalog.overview_ui && this.state.dataDetails.catalog.overview_ui.en ?
                                                this.state.dataDetails.catalog.overview_ui.en.long_description || this.state.dataDetails.catalog.overview_ui.en.description
                                            : this.state.dataDetails.service ?
                                                this.state.dataDetails.service.desc
                                            :
                                                this.state.dataDetails.desc
                                        }
                                    </p>
                                    <br />
                                    {this.state.dataDetails.catalog && this.state.dataDetails.catalog.provider &&
                                        <>
                                            <div class="attribute">
                                                <p>
                                                    <strong>Provider: </strong>
                                                    <Tag type="blue">{this.state.dataDetails.catalog.provider.name}</Tag>
                                                </p>
                                            </div>
                                        </>
                                    }
                                    {this.state.dataDetails.service &&
                                        <>
                                            {this.state.dataDetails.service.grouping ? <div class="attribute"><p><span class="name">Group: </span> <Tag type="blue">{this.state.dataDetails.service.grouping}</Tag></p></div> : <></>}
                                            {this.state.dataDetails.service.deployment_method ? <div class="attribute"><p><span class="name">Deployment Method: </span> <Tag type="blue">{this.state.dataDetails.service.deployment_method}</Tag></p></div> : <></>}
                                            {this.state.dataDetails.service.provision ? <div class="attribute"><p><span class="name">Provision: </span> <Tag type="blue">{this.state.dataDetails.service.provision}</Tag></p></div> : <></>}
                                            {
                                                this.state.dataDetails.service.cloud_automation_id ? 
                                                    <div class="attribute"><p><span class="name">Cloud Automation id: </span> <Tag type="blue">{this.state.dataDetails.service.cloud_automation_id}</Tag></p></div>
                                                : this.state.dataDetails.service.hybrid_automation_id ?
                                                    <div class="attribute"><p><span class="name">Hybrid Automation id: </span> <Tag type="blue">{this.state.dataDetails.service.hybrid_automation_id}</Tag></p></div>
                                                :
                                                    <div class="attribute"><p><span class="name">Automation id: </span> <Tag type="red"><WarningAlt16 style={{'margin-right': '3px'}} /> No Automation ID</Tag></p></div>
                                            }
                                        </>
                                    }
                                    {this.state.dataDetails.catalog && this.state.dataDetails.catalog.geo_tags && this.state.dataDetails.catalog.geo_tags.length > 0 &&
                                        <>
                                            <div class="attribute">
                                                <p>
                                                    <strong>Geos: </strong>
                                                    {this.state.dataDetails.catalog.geo_tags.map((geo) => (
                                                        <Tag type="blue">{geo}</Tag>
                                                    ))}
                                                </p>
                                            </div>
                                        </>
                                    }
                                    {this.state.dataDetails.service && this.state.dataDetails.service.controls && this.state.dataDetails.service.controls.length > 0 &&
                                        <>
                                            <div class="attribute">
                                                <p>
                                                    <strong>Impacting controls: </strong>
                                                    {this.state.dataDetails.service.controls.map((control) => (
                                                        <Tag type="blue">{control.control_id}</Tag>
                                                    ))}
                                                </p>
                                            </div>
                                        </>
                                    }
                                    {this.state.dataDetails.catalog && this.state.dataDetails.catalog.metadata && this.state.dataDetails.catalog.metadata.ui && this.state.dataDetails.catalog.metadata.ui.urls &&
                                        <>
                                            <div class="attribute">
                                                <p>
                                                    <strong>Links: </strong>
                                                    <UnorderedList nested>
                                                        {this.state.dataDetails.catalog.metadata.ui.urls.catalog_details_url && 
                                                            <ListItem href={this.state.dataDetails.catalog.metadata.ui.urls.catalog_details_url}>
                                                                <a href={this.state.dataDetails.catalog.metadata.ui.urls.catalog_details_url} target="_blank">
                                                                    Catalog
                                                                    <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                                </a>
                                                            </ListItem>
                                                        }
                                                        {this.state.dataDetails.catalog.metadata.ui.urls.apidocs_url && 
                                                            <ListItem href={this.state.dataDetails.catalog.metadata.ui.urls.apidocs_url}>
                                                                <a href={this.state.dataDetails.catalog.metadata.ui.urls.apidocs_url} target="_blank">
                                                                    API Docs
                                                                    <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                                </a>
                                                            </ListItem>
                                                        }
                                                        {this.state.dataDetails.catalog.metadata.ui.urls.doc_url && 
                                                            <ListItem href={this.state.dataDetails.catalog.metadata.ui.urls.doc_url}>
                                                                <a href={this.state.dataDetails.catalog.metadata.ui.urls.doc_url} target="_blank">
                                                                    Documentation
                                                                    <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                                </a>
                                                            </ListItem>
                                                        }
                                                        {this.state.dataDetails.catalog.metadata.ui.urls.instructions_url && 
                                                            <ListItem >
                                                                <a href={this.state.dataDetails.catalog.metadata.ui.urls.instructions_url} target="_blank">
                                                                    Instructions
                                                                    <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                                </a>
                                                            </ListItem>
                                                        }
                                                        {this.state.dataDetails.catalog.metadata.ui.urls.terms_url && 
                                                            <ListItem href={this.state.dataDetails.catalog.metadata.ui.urls.terms_url}>
                                                                <a href={this.state.dataDetails.catalog.metadata.ui.urls.terms_url} target="_blank">
                                                                    Terms
                                                                    <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                                </a>
                                                            </ListItem>
                                                        }
                                                    </UnorderedList>
                                                </p>
                                            </div>
                                        </>
                                    }
                                </div>
                            :
                                <div>
                                    <BreadcrumbSkeleton />
                                    <SearchSkeleton />
                                </div>
                        }
                    </SlidingPane>
                </div>
            </>
        );
    }
}

export default BillofMaterialsView;
