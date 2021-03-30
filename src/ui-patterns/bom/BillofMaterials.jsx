import React, { Component } from "react";
import 'carbon-components/css/carbon-components.min.css';
import * as _ from 'lodash';

import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import ServiceModal from './AddServiceModal';
import ServiceDetailsPane from '../services/ServiceDetailsPane';

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View,
    Add16,
    WarningAlt16
} from '@carbon/icons-react';
import {
    ComposedModal, ModalHeader, ModalBody, Tag,
    DataTable, DataTableSkeleton, TableContainer, Table, TableSelectAll, TableBatchAction, TableSelectRow,
    TableBatchActions, TableToolbar, TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction,
    OverflowMenu, OverflowMenuItem
} from 'carbon-components-react';
import { Button } from 'carbon-components-react';
import { Pagination } from 'carbon-components-react';
import { bomHeader } from '../data/data';
import ValidateModal from "../ValidateModal"

import { ToastNotification } from "carbon-components-react";

class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            archid: null,
            data: [],
            headersData: bomHeader,
            show: false,
            showValidate: false,
            selectedRows: [],
            showDiagram: false,
            isUpdate: false,
            serviceRecord: [],
            architecture: {},
            totalItems: 0,
            firstRowIndex: 0,
            currentPageSize: 10,
            isPaneOpen: false,
            dataDetails: false,
            notifications: []
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.showDiagram = this.showDiagram.bind(this);
        this.hideDiagram = this.hideDiagram.bind(this);
        this.openPane = this.openPane.bind(this);
        this.hidePane = this.hidePane.bind(this);
        this.validateCancel = this.validateCancel.bind(this);
        this.validateSubmit = this.validateSubmit.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }
    async loadTable() {
        const arch = await this.props.archService.getArchitectureById(this.props.archId);
        const jsonData = await this.props.bomService.getBOM(this.props.archId, {"include":["service"]});
        // Reformat data to augment BOM details with service details
        for (let index = 0; index < jsonData.length; index++) {
            let row = jsonData[index];
            row.ibm_service = {
                ibm_service: (row.service && row.service.ibm_catalog_service) || row.service_id,
                service_id: row.service_id
            };
            row.automation_id = (row.service && row.service.cloud_automation_id) || '';
            row.deployment_method = (row.service && row.service.deployment_method) || '';
            row.provision = (row.service && row.service.provision) || '';
            row.grouping = (row.service && row.service.grouping) || '';
        }
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
    async componentDidMount() {
        await this.loadTable();
    }

    openPane = async (bomId) => {
        if (bomId) {
            this.setState({
                isPaneOpen: true,
                dataDetails: false
            });
            this.props.bomService.getBomDetails(bomId).then((jsonData) => {
                this.setState({
                    dataDetails: jsonData
                });
            });
        }
    };

    hidePane = () => {
        this.setState({ isPaneOpen: false });
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
        console.log(url, filename)
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

    deleteBOMs(rows) {
        this.setState({
          showValidate: true,
          selectedRows: rows
        })
    }

    // API issues there So need to work on this function
    validateSubmit() {
        const rows = this.state.selectedRows;
        let count = 0;
        let total_count = rows.length;
        let count_success = 0;
        rows.forEach(data => {
            this.props.bomService.doDeleteBOM(data.id).then(res => {
                count = count + 1;
                if (res.statusCode === 204) {
                    count_success = count_success + 1;
                }
                if (count === total_count && count === count_success) {
                    this.addNotification('success', 'Success', `${count_success} service(s) successfully deleted!`)
                    this.setState({
                        showValidate: false ,
                        selectedRows: []
                    });
                    this.loadTable();
                } else if (count === total_count) {
                    this.addNotification('error', 'Error', `${count_success} service(s) successfully deleted, ${count - count_success} error(s)!`)
                    this.setState({
                        showValidate: false ,
                        selectedRows: []
                    });
                    this.loadTable();
                }
            });
        });
    }

    validateCancel = () => {
        this.setState({
            showValidate: false ,
            selectedRows: []
        });
    }

    /*********Modal From Code Start*****************/

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({
            isUpdate: false,
            show: false
        });
        this.loadTable();
    };
    doUpdateService(bomId) {
        this.setState({
            show: true,
            isUpdate: true,
            serviceRecord: this.state.data.find(element => element.id === bomId )
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


    /** Notifications */

    addNotification(type, message, detail) {
        this.setState(prevState => ({
          notifications: [
            ...prevState.notifications,
            {
              message: message || "Notification",
              detail: detail || "Notification text",
              severity: type || "info"
            }
          ]
        }));
    }

    renderNotifications() {
        return this.state.notifications.map(notification => {
            return (
            <ToastNotification
                title={notification.message}
                subtitle={notification.detail}
                kind={notification.severity}
                timeout={5000}
                caption={false}
            />
            );
        });
    }

    /** Notifications END */

    render() {
        let data = this.state.data;
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
                                <TableBatchActions {...getBatchActionProps()} shouldShowBatchActions={getBatchActionProps().totalSelected}>
                                    <TableBatchAction
                                        tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                        renderIcon={Delete}
                                        onClick={() => this.deleteBOMs(selectedRows)}
                                    >
                                        Delete
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
                                                            cell.info && cell.info.header === "ibm_service"?
                                                                <Tag type="blue">
                                                                    <Link to={"/services/" + cell.value.service_id} >
                                                                    {cell.value.ibm_service}
                                                                    </Link>
                                                                </Tag> 
                                                            : cell.info && cell.info.header === "automation_id" && !cell.value?
                                                                <Tag type="red"><WarningAlt16 style={{'margin-right': '3px'}} /> No Automation ID</Tag>
                                                            :
                                                                cell.value
                                                        }
                                                    </TableCell>
                                                ))}
                                                <TableCell className="bx--table-column-menu">
                                                    <OverflowMenu light flipped>
                                                        <OverflowMenuItem itemText="Edit" onClick={() => this.doUpdateService(row.id)} />
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
        const showValidateModal = this.state.showValidate;
        return (
            <>
                <div class='notif'>
                    {this.state.notifications.length !== 0 && this.renderNotifications()}
                </div>
                <div>
                    {showModal &&
                        <ServiceModal
                            toast={this.addNotification}
                            archId={archid}
                            show={this.state.show}
                            handleClose={this.hideModal}
                            service={this.props.bomService}
                            isUpdate={this.state.isUpdate}
                            data={this.state.serviceRecord}
                            services={this.state.serviceNames}
                        />
                    }
                    {showDiagram &&
                        <ComposedModal
                            open={showDiagram}
                            onClose={this.hideDiagram}>
                            <ModalHeader title={this.state.architecture.name} />
                            <ModalBody><img src={'/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_png} alt="Reference Architecture diagram" /></ModalBody>
                        </ComposedModal>}
                </div>
                <div>
                    {showValidateModal &&
                        <ValidateModal
                            danger
                            submitText="Delete"
                            heading="Delete Services"
                            message="You are about to remove services from this Bill Of Materials. This action cannot be undone, are you sure you want to proceed?"
                            show={this.state.showValidate}
                            onClose={this.validateCancel} 
                            onRequestSubmit={this.validateSubmit} 
                            onSecondarySubmit={this.validateCancel} />
                    }
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
                    <ServiceDetailsPane data={this.state.dataDetails} open={this.state.isPaneOpen} onRequestClose={this.hidePane}/>
                </div>
            </>
        );
    }
}

export default BillofMaterialsView;
