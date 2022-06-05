import React, { Component } from "react";

import * as _ from 'lodash';

import {
    Breadcrumb, BreadcrumbItem, Grid, Row, Column
} from 'carbon-components-react'

import {
    Link
} from "react-router-dom";

import {
    Delete16 as Delete,
    Download16 as Download,
    ViewFilled16 as View,
    Edit16,
    Add16,
    DocumentExport16 as DocumentExport
} from '@carbon/icons-react';
import {
    ComposedModal, ModalHeader, ModalBody, Tag, TagSkeleton,
    DataTable, DataTableSkeleton, TableContainer, Table, TableSelectAll, 
    TableBatchAction, TableSelectRow, TableBatchActions, TableToolbar, 
    TableToolbarMenu, TableToolbarContent, TableToolbarSearch, TableHead, 
    TableRow, TableHeader, TableBody, TableCell, TableToolbarAction,
    OverflowMenu, OverflowMenuItem, ContentSwitcher, Switch, BreadcrumbSkeleton,
    SearchSkeleton, CodeSnippet, Button, Pagination
} from 'carbon-components-react';

import YAML from 'yaml';

import ServiceModal from './AddServiceModal';
import ArchitectureModal from '../../builder/ArchitectureModal';
import ServiceDetailsPane from '../services/ServiceDetailsPane';
import { bomHeader } from '../../../data/data';
import ValidateModal from "../../ValidateModal"
import NotFound from "../../NotFound";

import { getArchitectureById } from '../../../services/architectures';
import {
    getBOM, getServices, getBomComposite, getBomDetails, doDeleteBOM
} from '../../../services/boms';

class BillofMaterialsView extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isSoftware: false,
            user: undefined,
            archid: false,
            data: [],
            filterData: [],
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
            dataDetails: false
        };
        this.loadTable = this.loadTable.bind(this);
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
        this.filterTable = this.filterTable.bind(this);
        this.downloadReport = this.downloadReport.bind(this);
    }
    async loadTable() {
        try {
            const arch = await getArchitectureById(this.props.archId);
            const jsonData = await getBOM(this.props.archId, {"include":["service"]});
            const bomDetails = JSON.parse(JSON.stringify(jsonData).replace(/"_id":/g, "\"id\":"));
            let services = await getServices();
            // Reformat data to augment BOM details with service details
            const conflicts = [];
            for (let index = 0; index < bomDetails.length; index++) {
                let row = bomDetails[index];
                row.service = services?.find(s => s.service_id === row.service_id);
                if (!row.service) conflicts.push(row.service_id);
                row.description = row.service?.description;
                row.group = row.service?.group;
                row.type = row.service?.type;
                row.provider = row.service?.cloudProvider || row.service?.softwareProvider || row.service?.provider;
                row.ibm_service = {
                    ibm_service: row.service?.displayName || row.service?.fullname || row.service_id,
                    service_id: row.service_id
                };
            }
            if (conflicts.length > 0) {
                this.props.addNotification('error', 'Conflicts', `Services ${conflicts.join(', ')} could not be found in automation catalog, please update this Bill of Material.`)
            }
            getBomComposite(this.props.archId).then((res) => { 
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
            const bomYaml = YAML.parse(arch.yaml);
            this.setState({
                archid: this.props.archId,
                data: bomDetails,
                filterData: bomDetails,
                architecture: arch,
                isSoftware: bomYaml?.metadata?.labels?.type === 'software',
                totalItems: bomDetails.length,
                services: services
            });
        } catch (error) {
            this.setState({
                error: error
            });
        }
    }
    async componentDidMount() {
        this.loadTable();
    }

    openPane = async (bomId) => {
        if (bomId) {
            this.setState({
                isPaneOpen: true,
                dataDetails: false
            });
            getBomDetails(bomId).then((jsonData) => {
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
                    <Link to={`/boms/${this.state.isSoftware ? 'software' : 'infrastructure'}`}>Reference Architectures</Link>
                </BreadcrumbItem>
                <BreadcrumbItem href="#">{title}</BreadcrumbItem>
            </Breadcrumb>
        )
    }

    downloadTerraform(archid, archname) {

        if (_.isNull(archid)) {
            this.props.addNotification("error", "ERROR", "Cannot Download Automation at this time.");
            return
        }

        // Create File name from Name of Architecture
        var filename = archname.replace(/[^a-z0-9_-]/gi, '-').replace(/_{2,}/g, '_').toLowerCase()
        var url = "/api/automation/" + archid;
        filename = filename + "-automation.zip";
        console.log(url, filename)
        this.props.addNotification("info", "BUILDING", "Started building your terraform module.");
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
                    this.props.addNotification("error", response.status + " " + response.statusText, "Error building your terraform module.");
                }
            });
    }

    viewDiagram() {
        alert("Download Automation");
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
            doDeleteBOM(data.id).then(res => {
                count = count + 1;
                if (res.statusCode === 204) {
                    count_success = count_success + 1;
                }
                if (count === total_count && count === count_success) {
                    this.props.addNotification('success', 'Success', `${count_success} service(s) successfully deleted!`)
                    this.setState({
                        showValidate: false ,
                        selectedRows: []
                    });
                    this.loadTable();
                } else if (count === total_count) {
                    this.props.addNotification('error', 'Error', `${count_success} service(s) successfully deleted, ${count - count_success} error(s)!`)
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

    async filterTable(searchValue) {
        if (searchValue) {
            const filterData = this.state.data.filter(elt => elt?.desc?.includes(searchValue) || elt?.service_id?.includes(searchValue));
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

    async downloadReport() {
        this.props.addNotification('info', 'Generating Report', 'Generating your PDF report, please wait.');
        fetch(`/api/architectures/${this.props.archId}/compliance-report?profile=IBM_CLOUD_FS_BP_0_1`)
        .then(res => {
            if (res && res.status === 200) {
                res.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${((this.state.architecture && this.state.architecture.name) || this.props.archId).toLowerCase().replace(/ /gi, '-')}-compliance-report.pdf`;;
                    a.click();
                });
            } else {
                res.json().then(body => {
                    if (body?.error?.message) this.props.addNotification("error", res?.status === 401 ? "Unauthorized" : "Error", body?.error?.message);
                })
            }
        })
        .catch(err => {
            console.error(err);
            this.props.addNotification('error', 'Error', `Error Generating your PDF report.${err && " Details: " + err}`);
        });
    }

    render() {
        let data = this.state.filterData;
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
                    <div>
                        {showServiceModal &&
                            <ServiceModal
                                toast={this.props.addNotification}
                                archId={archid}
                                show={this.state.showServiceModal}
                                handleClose={this.hideServiceModal}
                                isUpdate={this.state.isUpdate}
                                data={this.state.serviceRecord}
                                services={this.state.services}
                            />
                        }
                        {showArchitectureModal &&
                            <ArchitectureModal
                                toast={this.props.addNotification}
                                data={this.state.architecture}
                                show={this.state.showArchitectureModal}
                                handleClose={this.hideArchitectureModal}
                                handleReload={this.loadTable}
                                isUpdate={this.state.isUpdate}
                            />
                        }
                        {showDiagram &&
                            <ComposedModal
                                open={showDiagram}
                                onClose={this.hideDiagram}>
                                <ModalHeader title={this.state.architecture.name} />
                                <ModalBody><img type="image/png" src={`/api/architectures/${this.state.architecture.arch_id}/diagram/png`} alt="Reference Architecture diagram" style={{'width': '100%'}}/></ModalBody>
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
                    
                    <Grid>
                        {this.breadCrumbs(title)}
                        <Row>
                            <Column lg={{span: 12}}>
                                <h2>
                                    {
                                        this.state.architecture && this.state.architecture.name
                                    }
                                    {this.state.architecture?.confidential === "TRUE" && <Tag type="red" style={{"marginLeft": "10px"}}>Confidential</Tag>}
                                    {this.state.architecture?.production_ready === "TRUE" && <Tag type="green" style={{"marginLeft": "5px"}}>Production Ready</Tag> }
                                </h2>
    
                                <br />
                                <ContentSwitcher
                                    size='xl'
                                    onChange={(e) => {this.setState({showContent:e.name})}} >
                                    <Switch name="arch-data" text="Reference Architecture Details" />
                                    <Switch name="arch-diagram" text="Reference Architecture Diagram" />
                                    {this.state.architecture?.yaml ? <Switch name="arch-yaml" text="YAML Configuration" /> : <></>}
                                </ContentSwitcher>
                                <br />
                            </Column>
                        </Row>
    
                        { this.state.showContent === "arch-diagram" && <img src={`/api/architectures/${this.state.architecture.arch_id}/diagram/png`} alt="Reference Architecture diagram" style={{'width': '100%'}}/>}
                        { this.state.showContent === "arch-yaml" && <p>
                                    <h3 className="landing-page__subheading">
                                        Automation Variables
                                    </h3>
                                    <CodeSnippet type="multi" hideCopyButton>
                                        {this.state.architecture.yaml}
                                    </CodeSnippet>
                                <br />
                                </p>}
                        { this.state.showContent === "arch-data" && <div>
                            <p>
                                <h3 className="landing-page__subheading">
                                    Description
                                </h3>
                                {
                                    this.state.architecture?.long_desc || this.state.architecture?.short_desc
                                }
                            </p>
                            <br />
                            <h3 className="landing-page__subheading">
                                Bill Of Materials
                            </h3>
                            <p>
                                List of modules that form the bill of materials for this reference architecture
                            </p>
                            <br></br>
    
                            <Row>
                                <Column lg={{span: 12}}>
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
                                                        {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableBatchActions {...getBatchActionProps()} shouldShowBatchActions={getBatchActionProps().totalSelected}>
                                                            <TableBatchAction
                                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                                                                renderIcon={Delete}
                                                                onClick={() => this.deleteBOMs(selectedRows)}
                                                            >
                                                                Delete
                                                            </TableBatchAction>
                                                        </TableBatchActions>}
                                                        <TableToolbarContent>
                                                            <TableToolbarAction onClick={() => this.downloadTerraform(archid, title)}>
                                                                <Download /> Automation
                                                                        </TableToolbarAction>
                        
                                                        </TableToolbarContent>
                                                        <TableToolbarContent>
                        
                                                            <TableToolbarSearch onChange={(event) => this.filterTable(event.target.value)} tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0} />
                        
                                                            <TableToolbarMenu>
                                                                <TableToolbarAction style={{ display: 'flex' }} onClick={this.showDiagram}>
                                                                    <div>Diagram</div>
                                                                    <View style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>
                                                                <TableToolbarAction style={{ display: 'flex' }} href={`/api/architectures/${this.state.architecture.arch_id}/diagram/drawio`} download={`${this.state.architecture.arch_id}-diagram.drawio`}>
                                                                    <div style={{ flex: 'left' }}>Diagram .drawio</div>
                                                                    <Download style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>
                                                                {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableToolbarAction style={{ display: 'flex' }} onClick={() => this.updateArchitecture()}>
                                                                    <div style={{ flex: 'left' }}>Edit Architecure</div>
                                                                    <Edit16 style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>}
                                                                <TableToolbarAction style={{ display: 'flex' }} onClick={this.downloadReport} /*href={`/api/architectures/${this.props.archId}/compliance-report.pdf?profile=IBM_CLOUD_FS_BP_0_1`} download*/>
                                                                    <div style={{ flex: 'left' }}>PDF Report</div>
                                                                    <DocumentExport style={{ marginLeft: "auto" }} />
                                                                </TableToolbarAction>
                                                            </TableToolbarMenu>
                        
                        
                                                            {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <Button
                                                                tabIndex={getBatchActionProps().shouldShowBatchActions ? -1 : 0}
                                                                size="small"
                                                                kind="primary"
                                                                renderIcon={Add16}
                                                                onClick={this.showServiceModal}
                                                            >
                                                                Add Module
                                                            </Button>}
                                                        </TableToolbarContent>
                                                    </TableToolbar>
                                                    <Table {...getTableProps()}>
                                                        <TableHead>
                                                            <TableRow>
                                                                {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableSelectAll {...getSelectionProps()}/>}
                                                                {headers.map((header, i) => (
                                                                    <TableHeader key={i} {...getHeaderProps({ header })}>
                                                                        {header.header}
                                                                    </TableHeader>
                                                                ))}
                                                                {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableHeader />}
                                                            </TableRow>
                                                        </TableHead>
                        
                                                        <TableBody>
                                                            {rows.map((row, i) => (
                                                                <>
                                                                    <TableRow key={i} {...getRowProps({ row })} >
                                                                        {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableSelectRow {...getSelectionProps({ row })}/>}
                                                                        {row.cells.map((cell) => (
                                                                            <TableCell key={cell.id} className="clickable" onClick={() => this.openPane(row.id)} >
                                                                                {
                                                                                    cell.info && cell.info.header === "ibm_service"?
                                                                                        <Tag type="blue">
                                                                                            <Link to={"/services/" + cell.value.service_id} >
                                                                                                {cell.value.ibm_service}
                                                                                            </Link>
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" && (this?.state?.compositeData[row.id]?.service?.fs_validated || this?.state?.compositeData[row.id]?.catalog?.tags?.includes("fs_ready")) ?
                                                                                        <Tag type="green">
                                                                                            FS Validated
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" && ["gitops","tools","ocp"].includes(this?.state?.compositeData[row.id]?.automation?.provider) ?
                                                                                        <Tag style={{"background-color": "#F5606D"}}>
                                                                                            OpenShift Software
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" && this?.state?.compositeData[row.id] ?
                                                                                        <Tag>
                                                                                            Not yet
                                                                                        </Tag>
                                                                                    : cell.info && cell.info.header === "fs_validated" ?
                                                                                        <TagSkeleton></TagSkeleton>
                                                                                    : cell.value
                                                                                }
                                                                            </TableCell>
                                                                        ))}
                                                                        {(this.props.user?.role === "admin" || this.state.architecture?.owners?.find(user => user.email === this.props.user?.email)) && <TableCell className="bx--table-column-menu">
                                                                            <OverflowMenu light flipped>
                                                                                <OverflowMenuItem itemText="Edit" onClick={() => this.doUpdateService(row.id)}/>
                                                                            </OverflowMenu>
                                                                        </TableCell>}
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
                                </Column>
                            </Row>
                        </div>}
                    </Grid>
                    <div>
                        <ServiceDetailsPane data={this.state.dataDetails} open={this.state.isPaneOpen} onRequestClose={this.hidePane}/>
                    </div>
                </>
            : this.state.error ?
                <NotFound />
            :
                <Grid>
                    <Row>
                        <Column lg={{span: 12}}>
                            <BreadcrumbSkeleton />
                            <SearchSkeleton />``
                        </Column>
                    </Row>
                </Grid>
        );
    }
}

export default BillofMaterialsView;
