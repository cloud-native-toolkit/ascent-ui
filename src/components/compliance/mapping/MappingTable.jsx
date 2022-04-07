import React, { Component } from 'react';
import {
  Button,
  Tag,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableToolbar,
  TableHeader,
  TableBody,
  TableToolbarContent,
  TableCell,
  TableToolbarSearch,
  OverflowMenu,
  OverflowMenuItem,
  TableSelectAll,
  TableSelectRow,
  TableBatchActions,
  TableBatchAction,
  TableToolbarMenu,
  TableToolbarAction,
  TagSkeleton
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import {
  Delete16 as Delete,
  Add16,
  Launch16,
  DocumentImport16 as DocumentImport
} from '@carbon/icons-react';
import MappingModal from "./MappingModal"
import ImportProfileModal from "./ImportProfileModal"
import ValidateModal from "../../ValidateModal"

class MappingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      mappingRecord: [],
      show: false,
      showValidate: false,
      showImportProfile: false,
      selectedRows: []
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.validateCancel = this.validateCancel.bind(this);
    this.validateSubmit = this.validateSubmit.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };
  
  validateSubmit = () => {
    this.setState({ showValidate: false });
    const rows = this.state.selectedRows;
    let body = {};
    let count = 0;
    let total_count = rows.length;
    let count_success = 0;
    rows.forEach((row) => {
      let control_id = "";
      let service_id = "";
      let arch_id = "";
      let control_subsections= "";
      let scc_profile= "";
      if (row.cells && row.cells.length) {
        row.cells.forEach((cell) => {
          if (cell.info && cell.info.header === "control_id") {
            control_id = cell.value;
          } else if (cell.info && cell.info.header === "component_id") {
            if (cell.value && cell.value.arch) {
              arch_id = cell.value.val;
            } else {
              service_id = cell.value.val;
            }
          } else if (cell.info && cell.info.header === "control_subsections") {
            control_subsections = cell.value;
          } else if (cell.info && cell.info.header === "scc_profile") {
            scc_profile = cell.value;
          }
        });
      }
      
      if (service_id) {
        body = {
          control_id: control_id,
          service_id: service_id,
          scc_profile: scc_profile,
          control_subsections: control_subsections
        }
      } else {
        body = {
          control_id: control_id,
          arch_id: arch_id,
          scc_profile: scc_profile,
          control_subsections: control_subsections
        }
      }
      this.props.mapping.deleteMapping(body).then((res) => {
        count = count + 1;
        if (res.statusCode === 200) {
          count_success = count_success + 1;
        }
        if (count === total_count && count === count_success) {
          this.props.toast('success', 'Success', `${count_success} mapping(s) successfully deleted!`)
          this.props.handleReload();
        } else if (count === total_count) {
          this.props.toast('error', 'Error', `${count_success} mapping(s) successfully deleted, ${count - count_success} error(s)!`)
          this.props.handleReload();
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

  deleteMappings(rows) {
    this.setState({
      showValidate: true,
      selectedRows: rows
    })
  }

  hideModal = () => {
    this.setState(
      {
        show: false,
        isUpdate: false,
        mappingRecord: []
      }
    );
    this.props.handleReload();
  };

  updateMapping(mappingId) {
    this.setState({
        show: true,
        isUpdate: true,
        mappingRecord: this.props.data.find(element => element.id === mappingId )
    });
  }

  async componentDidMount(){
    fetch('/userDetails')
      .then(res => res.json())
      .then(user => {
        if (user.name) {
          this.setState({ user: user || undefined });
        } else {
          // Redirect to login page
          window.location.href = "/login";
        }
      });
  }

  render() {
    const showModal = this.state.show;
    const showValidateModal = this.state.showValidate;
    for (let index = 0; index < this.props.rows.length; index++) {
      let row = this.props.rows[index];
      console.log(row?.service)
      row.component_id = {
        val: row.service_id || row.arch_id,
        serviceName: row?.service?.fullname || row?.service?.service_id,
        arch: row.arch_id ? true : false,
        service: row.service_id ? true : false,
        details: {
          desc: row.desc,
          configuration: row.configuration,
          comment: row.comment,
          scc_goals: row.goals
        }
      }
    }
    return (
      <>
        <div>
          {showModal &&
            <MappingModal
              toast={this.props.toast}
              show={this.state.show}
              handleClose={this.hideModal}
              isUpdate={this.state.isUpdate}
              data={this.state.mappingRecord}
              mapping={this.props.mapping}
              controls={this.props.controls}
              services={this.props.services}
              arch={this.props.arch}
              serviceId={this.props.serviceId} 
              controlId={this.props.controlId} />
          }
        </div>
        <div>
          {showValidateModal &&
            <ValidateModal
              danger
              submitText="Delete"
              heading="Delete Mappings"
              message="You are about to delete some control mappings, i.e. unlink some FS controls from specific components (services, ref. architectures). This action cannot be undone, are you sure you want to proceed?"
              show={this.state.showValidate}
              onClose={this.validateCancel} 
              onRequestSubmit={this.validateSubmit} 
              onSecondarySubmit={this.validateCancel} />
          }
        </div>
        <div>
          {this.state.showImportProfile &&
            <ImportProfileModal
              submitText="Import"
              show={this.state.showImportProfile}
              onClose={() => this.setState({showImportProfile: false})} 
              closeAndReload={() => {
                this.setState({showImportProfile: false});
                this.props.handleReload();
              }} 
              onSecondarySubmit={() => this.setState({showImportProfile: false})}
              mapping={this.props.mapping}
              toast={this.props.toast} />
          }
        </div>
        <DataTable rows={this.props.rows} headers={this.props.headers}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getToolbarProps,
            getTableContainerProps,
            getSelectionProps,
            getBatchActionProps,
            selectedRows
          }) => (
            <TableContainer
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                {this.state.user?.role === "admin" && <TableBatchActions {...getBatchActionProps()} shouldShowBatchActions={getBatchActionProps().totalSelected}>
                    <TableBatchAction
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                        renderIcon={Delete}
                        onClick={() => this.deleteMappings(selectedRows)}>
                        Delete
                    </TableBatchAction>
                </TableBatchActions>}
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(event) => this.props.filterTable(event.target.value)} />
                  {this.state.user?.role === "admin" && <TableToolbarMenu>
                    <TableToolbarAction style={{ display: 'flex' }} onClick={() => this.setState({ showImportProfile: true })}>
                      <div style={{ flex: 'left' }}>Import Profile</div>
                      <DocumentImport style={{ marginLeft: "auto" }} />
                    </TableToolbarAction>
                  </TableToolbarMenu>}
                  {this.state.user?.role === "admin" && <Button
                    size="small"
                    kind="primary"
                    renderIcon={Add16} 
                    onClick={this.showModal}>Add
                  </Button>}
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    {this.state.user?.role === "admin" && <TableSelectAll {...getSelectionProps()} />}
                    {headers.map((header) => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    {this.state.user?.role === "admin" && <TableHeader></TableHeader>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <>
                      <TableExpandRow key={row.id} {...getRowProps({ row })}>
                        {this.state.user?.role === "admin" && <TableSelectRow {...getSelectionProps({ row })} />}
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {
                              cell.info && cell.info.header === "control_id" ?
                                <Tag type="blue">
                                  <Link to={"/controls/" + cell.value.toLowerCase().replace(' ', '_')} >
                                    {cell.value}
                                  </Link>
                                </Tag>
                              : cell.info && cell.info.header === "component_id" && cell.value && cell.value.service && cell.value.serviceName ?
                                <Tag type="blue">
                                  <Link to={"/services/" + cell.value.val} >
                                    {cell.value.serviceName}
                                  </Link>
                                </Tag>
                              : cell.info && cell.info.header === "component_id" && cell.value && cell.value.service?
                                <Tag>
                                  {cell.value.val}
                                </Tag>
                              : cell.info && cell.info.header === "component_id" && cell.value && cell.value.arch ?
                                <Tag type="blue">
                                  <Link to={"/boms/" + cell.value.val} >
                                    {cell.value.val}
                                  </Link>
                                </Tag>
                              :
                                cell.value
                            }
                          </TableCell>
                        ))}
                        {this.state.user?.role === "admin" && <TableCell>
                          <OverflowMenu light flipped>
                            <OverflowMenuItem itemText="Edit" onClick={() => this.updateMapping(row.id)} />
                            {/* <OverflowMenuItem itemText="Archive Profile" onClick={async () => {
                              const profileId = row.cells.find(cell => cell.info.header === 'scc_profile').value;
                              const response = await fetch(`/api/mapping/profiles/${profileId}/archive`, {method: 'POST'});
                              if (response.status === 204) {
                                this.props.toast('success', 'Success', `Profile ${profileId} successfully archived!`)
                                this.props.handleReload();
                              } else {
                                this.props.toast('error', 'Error', `Error archiving profile ${profileId}.`)
                              }
                            }} /> */}
                          </OverflowMenu>
                        </TableCell>}
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 3}
                        className="demo-expanded-td">
                        {row.cells && row.cells.length && row.cells.map((cell) => (
                          <>
                            {cell.info && cell.info.header === "component_id" && cell.value && cell.value.details && cell.value.details.desc &&
                              <><h6 style={{'margin-top': '10px'}}>Description</h6><div>{cell.value.details.desc}</div></>}
                            {
                              cell.info && cell.info.header === "component_id" && cell.value && cell.value.details &&
                                <>
                                  <h6 style={{'margin-top': '10px'}}>SCC Goals</h6>
                                  {
                                    cell.value.details.scc_goals !== undefined ?
                                      cell.value.details.scc_goals.map((goal) => (
                                        goal.goal_id.match(/^\d{7}$/) ?
                                          <>
                                            <Tag type="blue">
                                              <a href={"https://cloud.ibm.com/security-compliance/goals/" + goal.goal_id} target="_blank" rel="noopener noreferrer" >
                                                {goal.goal_id}
                                                <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                              </a>
                                            </Tag>
                                          </>
                                        :
                                          goal.goal_id
                                        ))
                                    :
                                      <><TagSkeleton /><TagSkeleton /></>
                                  }
                                  
                                </>
                            }
                            {cell.info && cell.info.header === "component_id" && cell.value && cell.value.details && cell.value.details.configuration &&
                              <><h6 style={{'margin-top': '10px'}}>Configuration</h6><div>{cell.value.details.configuration}</div></>}
                            {cell.info && cell.info.header === "component_id" && cell.value && cell.value.details && cell.value.details.comment &&
                              <><h6 style={{'margin-top': '10px'}}>Comment</h6><div>{cell.value.details.comment}</div></>}
                          </>
                        ))}
                      </TableExpandedRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </>
    );
  }
}
export default MappingTable;
