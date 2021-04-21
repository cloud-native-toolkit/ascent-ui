import React, { Component } from "react";
import 'carbon-components/css/carbon-components.min.css';
import * as _ from 'lodash';

import { Breadcrumb, BreadcrumbItem } from 'carbon-components-react'
import ServiceModal from './AddServiceModal';
import ArchitectureModal from './ArchitectureModal';
import ServiceDetailsPane from '../services/ServiceDetailsPane';

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Save16 as Save,
    Download16 as Download,
    ViewFilled16 as View,
    Edit16,
    Add16,
    WarningAlt16,
    Launch16
} from '@carbon/icons-react';
import {
    ComposedModal, ModalHeader, ModalBody, Tag, TagSkeleton,
    DataTable, DataTableSkeleton, TableContainer, Table, TableSelectAll, TableBatchAction, TableSelectRow,
    TableBatchActions, TableToolbar, TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, TableRow, TableHeader, TableBody, TableCell, TableToolbarAction,
    OverflowMenu, OverflowMenuItem, ContentSwitcher, Switch, BreadcrumbSkeleton,
    SearchSkeleton, CodeSnippet
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
            userRole: "editor",
            archid: false,
            data: [],
            compositeData: [],
            headersData: bomHeader,
            showServiceModal: false,
            showArchitectureModal: false,
            showContent: "arch-data",
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
        this.showServiceModal = this.showServiceModal.bind(this);
        this.hideServiceModal = this.hideServiceModal.bind(this);
        this.showArchitectureModal = this.showArchitectureModal.bind(this);
        this.hideArchitectureModal = this.hideArchitectureModal.bind(this);
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
        const bomDetails = JSON.parse(JSON.stringify(jsonData).replace(/\"_id\":/g, "\"id\":"));
        let service_list = await this.props.bomService.getServices();
        // Reformat data to augment BOM details with service details
        for (let index = 0; index < bomDetails.length; index++) {
            let row = bomDetails[index];
            row.ibm_service = {
                ibm_service: (row.service && row.service.ibm_catalog_service) || row.service_id,
                service_id: row.service_id
            };
            row.automation_id = (row.service && row.service.cloud_automation_id) || '';
            row.deployment_method = (row.service && row.service.deployment_method) || '';
            row.provision = (row.service && row.service.provision) || '';
            row.grouping = (row.service && row.service.grouping) || '';
        }
        this.props.bomService.getBomComposite(this.props.archId).then((res) => { 
            if(res && res.length) {
                let compositeData = {};
                for (let ix in res) {
                    compositeData[res[ix]._id] = res[ix];
                }
                this.setState({
                    compositeData: compositeData
                })
            }
        });
        this.setState({
            archid: this.props.archId,
            data: bomDetails,
            architecture: arch,
            totalItems: bomDetails.length,
            serviceNames: service_list
        });
    }
    async componentDidMount() {
        fetch('/userDetails')
        .then(res => res.json())
        .then(user => {
            this.setState({ userRole: user.role || undefined })
        })
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
        var url = "/api/automation/" + archid;
        filename = filename + "-automation.zip";
        console.log(url, filename)
        this.addNotification("info", "BUILDING", "Started building your terraform module.");
        fetch(url)
            .then(response => {
                if (response && response.status === 200) {
                    response.blob().then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        a.click();
                    });
                }
                else {
                    this.addNotification("error", response.status + " " + response.statusText, "Error building your terraform module.");
                }
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

    /*********Service Modal From Code Start*****************/

    showServiceModal = () => {
        this.setState({ showServiceModal: true });
    };

    hideServiceModal = () => {
        this.setState({
            isUpdate: false,
            showServiceModal: false
        });
        this.loadTable();
    };

    doUpdateService(bomId) {
        this.setState({
            showServiceModal: true,
            isUpdate: true,
            serviceRecord: this.state.data.find(element => element.id === bomId )
        });

    }

    /*********Architecture Modal From Code Start*****************/

    showArchitectureModal = () => {
        this.setState({ showArchitectureModal: true });
    };

    hideArchitectureModal = () => {
        this.setState({
            isUpdate: false,
            showArchitectureModal: false
        });
        this.loadTable();
    };

    updateArchitecture() {
        this.setState({
            showArchitectureModal: true,
            isUpdate: true
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
                timeout={10000}
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
        let showServiceModal = this.state.showServiceModal;
        let showArchitectureModal = this.state.showArchitectureModal;
        let showDiagram = this.state.showDiagram;
        const showValidateModal = this.state.showValidate;
        return (
            this.state.archid ?
                <>
                    <div class='notif'>
                        {this.state.notifications.length !== 0 && this.renderNotifications()}
                    </div>
                    <div>
                        {showServiceModal &&
                            <ServiceModal
                                toast={this.addNotification}
                                archId={archid}
                                show={this.state.showServiceModal}
                                handleClose={this.hideServiceModal}
                                service={this.props.bomService}
                                isUpdate={this.state.isUpdate}
                                data={this.state.serviceRecord}
                                services={this.state.serviceNames}
                            />
                        }
                        {showArchitectureModal &&
                            <ArchitectureModal
                                toast={this.addNotification}
                                architectureService={this.props.archService}
                                data={this.state.architecture}
                                show={this.state.showArchitectureModal}
                                handleClose={this.hideArchitectureModal}
                                isUpdate={this.state.isUpdate}
                            />
                        }
                        {showDiagram &&
                            <ComposedModal
                                open={showDiagram}
                                onClose={this.hideDiagram}>
                                <ModalHeader title={this.state.architecture.name} />
                                <ModalBody><img src={'/api/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_png} alt="Reference Architecture diagram" style={{'width': '100%'}}/></ModalBody>
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
                                <h2>
                                    {
                                        this.state.architecture && this.state.architecture.name
                                    }
                                    {this.state.architecture && this.state.architecture.confidential === "TRUE" && <Tag type="red" style={{"margin-left": "10px"}}>Confidential</Tag>}
                                    {this.state.architecture && this.state.architecture.production_ready === "TRUE" && <Tag type="green" style={{"margin-left": "5px"}}>Production Ready</Tag> }
                                </h2>
    
                                <br />
                                <ContentSwitcher
                                    size='xl'
                                    onChange={(e) => {this.setState({showContent:e.name})}} >
                                    <Switch name="arch-data" text="Reference Architecture Details" />
                                    <Switch name="arch-diagram" text="Reference Architecture Diagram" />
                                </ContentSwitcher>
                                <br />
                            </div>
                        </div>
    
                        { this.state.showContent === "arch-diagram" && <img src={'/api/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_png} alt="Reference Architecture diagram" style={{'width': '100%'}}/>}
                        { this.state.showContent === "arch-data" && <div>
                            <p>
                                <h3 className="landing-page__subheading">
                                    Description
                                </h3>
                                {
                                    this.state.architecture && this.state.architecture.long_desc || this.state.architecture.short_desc
                                }
                            </p>
                            <br />
                            { this.state.architecture && this.state.architecture.automation_variables &&
                                <p>
                                    <h3 className="landing-page__subheading">
                                        Automation Variables
                                    </h3>
                                    <CodeSnippet type="multi" hideCopyButton>
                                        {this.state.architecture.automation_variables}
                                    </CodeSnippet>
                                <br />
                                </p>
                            }
                            <h3 className="landing-page__subheading">
                                Bill Of Materials
                            </h3>
                            <p>
                                List of IBM Cloud services that form the bill of materials for this reference architecture
                            </p>
                            <br></br>
    
                            <div className="bx--row">
                                <div className="bx--col-lg-16">
                                    {this.state.archid === false ?
                                        <DataTableSkeleton
                                            columnCount={headers.length + 1}
                                            rowCount={10}
                                            showHeader={false}
                                            headers={null}
                                        />
                                    :
                                        <>
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
                                                                disabled={this.state.userRole !== "editor"}
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
                                                                <TableToolbarAction style={{ display: 'flex' }} href={'/api/images/' + this.state.architecture.diagram_folder + '/' + this.state.architecture.diagram_link_drawio} download>
                                                                    <div style={{ flex: 'left' }}>Diagram .drawio</div>
                                                                    <Download style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>
                                                                <TableToolbarAction style={{ display: 'flex' }} onClick={() => this.updateArchitecture()}>
                                                                    <div style={{ flex: 'left' }}>Edit Variables</div>
                                                                    <Edit16 style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>
                                                            </TableToolbarMenu>
                        
                        
                                                            <Button
                                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                                size="small"
                                                                kind="primary"
                                                                renderIcon={Add16}
                                                                onClick={this.showServiceModal}
                                                                disabled={this.state.userRole !== "editor"}
                                                            >
                                                                Add Service
                                                                        </Button>
                                                        </TableToolbarContent>
                                                    </TableToolbar>
                                                    <Table {...getTableProps()}>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableSelectAll {...getSelectionProps()} disabled={this.state.userRole !== "editor"}/>
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
                                                                        <TableSelectRow {...getSelectionProps({ row })} disabled={this.state.userRole !== "editor"}/>
                                                                        {row.cells.map((cell) => (
                                                                            <TableCell key={cell.id} class="clickable" onClick={() => this.openPane(row.id)} >
                                                                                {
                                                                                    cell.info && cell.info.header === "ibm_service"?
                                                                                        <Tag type="blue">
                                                                                            <Link to={"/services/" + cell.value.service_id} >
                                                                                            {cell.value.ibm_service}
                                                                                            </Link>
                                                                                        </Tag> 
                                                                                    : cell.info && cell.info.header === "automation_id" && !cell.value ?
                                                                                        <Tag type="red"><WarningAlt16 style={{'margin-right': '3px'}} /> No Automation ID</Tag>
                                                                                    : cell.info && cell.info.header === "automation_id" && this.state.compositeData && this.state.compositeData[row.id] && this.state.compositeData[row.id].automation ?
                                                                                        <Tag type="blue">
                                                                                            <a href={"https://" + this.state.compositeData[row.id].automation.id} target="_blank">
                                                                                                {this.state.compositeData[row.id].automation.name}
                                                                                                <Launch16 style={{"margin-left": "3px"}}/>
                                                                                            </a>
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" && this.state.compositeData && this.state.compositeData[row.id] && this.state.compositeData[row.id].catalog
                                                                                        && this.state.compositeData[row.id].catalog.tags && this.state.compositeData[row.id].catalog.tags.length > 0 && this.state.compositeData[row.id].catalog.tags.includes("fs_ready") ?
                                                                                        <Tag type="green">
                                                                                            FS Validated
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" && this.state.compositeData && this.state.compositeData[row.id] ?
                                                                                        <Tag>
                                                                                            Not yet
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" ?
                                                                                        <TagSkeleton></TagSkeleton>
                                                                                    : cell.info && cell.info.header === "automation_id" ?
                                                                                        <TagSkeleton></TagSkeleton>
                                                                                    : cell.value
                                                                                }
                                                                            </TableCell>
                                                                        ))}
                                                                        <TableCell className="bx--table-column-menu">
                                                                            <OverflowMenu light flipped>
                                                                                <OverflowMenuItem itemText="Edit" onClick={() => this.doUpdateService(row.id)} disabled={this.state.userRole !== "editor"}/>
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
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div>
                        <ServiceDetailsPane data={this.state.dataDetails} open={this.state.isPaneOpen} onRequestClose={this.hidePane}/>
                    </div>
                </>
            :
                <>
                    <BreadcrumbSkeleton />
                    <SearchSkeleton />
                </>
        );
    }
}

export default BillofMaterialsView;
