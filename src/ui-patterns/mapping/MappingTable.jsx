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
  TableBatchAction
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import {
  Delete16 as Delete,
  Add16,
  Launch16
} from '@carbon/icons-react';
import MappingModal from "./MappingModal"
import ValidateModal from "../ValidateModal"

class MappingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: "editor",
      mappingRecord: [],
      show: false,
      showValidate: false,
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
          }
        });
      }
      
      if (service_id) {
        body = {
          control_id: control_id,
          service_id: service_id
        }
      } else {
        body = {
          control_id: control_id,
          arch_id: arch_id
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

  render() {
    fetch('/userDetails')
    .then(res => res.json())
    .then(user => {
        this.setState({ userRole: user.role || undefined })
    })
    const showModal = this.state.show;
    const showValidateModal = this.state.showValidate;
    for (let index = 0; index < this.props.rows.length; index++) {
      let row = this.props.rows[index];
      row.component_id = {
        val: row.service_id || row.arch_id,
        arch: row.arch_id ? true : false,
        service: row.service_id ? true : false,
        details: {
          desc: row.desc,
          configuration: row.configuration,
          comment: row.comment,
          scc_goals: row.scc_goal
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
        <DataTable rows={this.props.rows} headers={this.props.headers}>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getToolbarProps,
            onInputChange,
            getTableContainerProps,
            getSelectionProps,
            getBatchActionProps,
            selectedRows
          }) => (
            <TableContainer
              {...getTableContainerProps()}>
              <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
                <TableBatchActions {...getBatchActionProps()} shouldShowBatchActions={getBatchActionProps().totalSelected}>
                    <TableBatchAction
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                        renderIcon={Delete}
                        onClick={() => this.deleteMappings(selectedRows)}
                        disabled={this.state.userRole !== "editor"}>
                        Delete
                    </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} />
                  <Button
                    size="small"
                    kind="primary"
                    renderIcon={Add16} 
                    onClick={this.showModal}
                    disabled={this.state.userRole !== "editor"}>Add
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    <TableSelectAll {...getSelectionProps()} disabled={this.state.userRole !== "editor"}/>
                    {headers.map((header) => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <>
                      <TableExpandRow key={row.id} {...getRowProps({ row })}>
                        <TableSelectRow {...getSelectionProps({ row })} disabled={this.state.userRole !== "editor"}/>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {console.log(cell)}
                            {
                              cell.info && cell.info.header === "control_id" ?
                                <Tag type="blue">
                                  <Link to={"/controls/" + cell.value.toLowerCase().replace(' ', '_')} >
                                    {cell.value}
                                  </Link>
                                </Tag>
                              : cell.info && cell.info.header === "component_id" && cell.value && cell.value.service ?
                                <Tag type="blue">
                                  <Link to={"/services/" + cell.value.val} >
                                    {cell.value.val}
                                  </Link>
                                </Tag>
                              : cell.info && cell.info.header === "component_id" && cell.value && cell.value.arch ?
                                <Tag type="blue">
                                  <Link to={"/bom/" + cell.value.val} >
                                    {cell.value.val}
                                  </Link>
                                </Tag>
                              :
                                cell.value
                            }
                          </TableCell>
                        ))}
                        <TableCell>
                          <OverflowMenu light flipped>
                            <OverflowMenuItem itemText="Edit" onClick={() => this.updateMapping(row.id)} disabled={this.state.userRole !== "editor"}/>
                          </OverflowMenu>
                        </TableCell>
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 3}
                        className="demo-expanded-td">
                        {row.cells && row.cells.length && row.cells.map((cell) => (
                          <>
                            {cell.info && cell.info.header === "component_id" && cell.value && cell.value.details && cell.value.details.desc &&
                              <><h6 style={{'margin-top': '10px'}}>Description</h6><div>{cell.value.details.desc}</div></>}
                            {
                              cell.info && cell.info.header === "component_id" && cell.value && cell.value.details && cell.value.details.scc_goals &&
                                <>
                                  <h6 style={{'margin-top': '10px'}}>SCC Goals</h6>
                                  {cell.value.details.scc_goals.split(new RegExp([' ', '-', '/', ':', ','].join('|'), 'g')).map((goalId) => (
                                  goalId.match(/^\d{7}$/) ?
                                    <>
                                      <Tag type="blue" renderIcon={Launch16}>
                                        <a href={"https://cloud.ibm.com/security-compliance/goals/" + goalId} target="_blank" >
                                          {goalId}
                                          <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                        </a>
                                      </Tag>
                                    </>
                                    :
                                    goalId
                                ))}
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
