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
  InlineNotification,
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
  Add16
} from '@carbon/icons-react';
import MappingModal from "./MappingModal"
import ValidateModal from "../ValidateModal"

class MappingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      showValidate: false,
      selectedRows: []
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };
  
  validateSubmit = () => {
    this.setState({ showValidate: false });
    const rows = this.state.selectedRows;
    let body = {};
    rows.forEach((row) => {
      let control_id = "";
      let service_id = "";
      let arch_id = "";
      row.cells.forEach((cell) => {
        if (cell.info.header === "control_id") {
          control_id = cell.value;
        } else if (cell.info.header === "component_id") {
          if (cell.value.arch) {
            arch_id = cell.value.val;
          } else {
            service_id = cell.value.val;
          }
        }
      });
      
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
        console.log(res);
        let notif = false;
          if (res && res.body && res.body.error) {
            notif = {
              kind: "error",
              title: res.body.error.code || res.body.error.name || "Error",
              message: res.body.error.message
            }
          } else {
            notif = {
              kind: "success",
              title: "Success",
              message: `Mappings successfully deleted.`
            }
          }
          this.props.handleReload();
          this.setState({ notif: notif });
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

  hideModal = (res) => {
    let notif = false;
    console.log(res)
    if (res && res.service_id && res.control_id) {
      notif = {
        kind: "success",
        title: "Success",
        message: `Control ${res.control_id} successfully mapped to component ${res.service_id || res.arch_id}`
      }
    }
    this.setState(
      {
        show: false,
        notif: notif
      }
    );
    this.props.handleReload();
  };


  render() {
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
          comment: row.comment
        }
      }
    }
    let notif = this.state.notif;
    return (
      <>
        {notif &&
          <InlineNotification
            id={Date.now()}
            hideCloseButton lowContrast
            title={notif.title || "Notification title"}
            subtitle={<span kind='error' hideCloseButton lowContrast>{notif.message || "Subtitle"}</span>}
            kind={notif.kind || "info"}
            caption={notif.caption || "Caption"}
          />
        }
        <div>
          {showModal &&
            <MappingModal
              show={this.state.show}
              handleClose={this.hideModal}
              isUpdate={this.state.isUpdate}
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
                <TableBatchActions {...getBatchActionProps()}>
                    <TableBatchAction
                        tabIndex={getBatchActionProps().shouldShowBatchActions ? 0 : -1}
                        renderIcon={Delete}
                        onClick={() => this.deleteMappings(selectedRows)}>
                        Delete
                    </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} />
                  <Button
                    size="small"
                    kind="primary"
                    renderIcon={Add16} 
                    onClick={this.showModal}>Add
                </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    <TableExpandHeader />
                    <TableSelectAll {...getSelectionProps()} />
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
                        <TableSelectRow {...getSelectionProps({ row })} />
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {
                              cell.info.header === "control_id" ?
                                <Tag type="blue">
                                  <Link to={"/controls/" + cell.value.toLowerCase().replace(' ', '_')} >
                                    {cell.value}
                                  </Link>
                                </Tag>
                                :
                                cell.info.header === "component_id" && cell.value.service ?
                                  <Tag type="blue">
                                    <Link to={"/services/" + cell.value.val} >
                                      {cell.value.val}
                                    </Link>
                                  </Tag>
                                  :
                                  cell.info.header === "component_id" && cell.value.arch ?
                                    <Tag type="blue">
                                      <Link to={"/bom/" + cell.value.val} >
                                        {cell.value.val}
                                      </Link>
                                    </Tag>
                                    :
                                    cell.info.header === "scc_goal" ?
                                      cell.value.split('/').map((goalId) => (
                                        goalId.match(/^\d{7}$/) ?
                                          <>
                                            <Tag type="blue">
                                              <a href={"https://cloud.ibm.com/security-compliance/goals/" + goalId} target="_blank" >
                                                {goalId}
                                              </a>
                                            </Tag>
                                          </>
                                          :
                                          goalId
                                      ))
                                      :
                                      cell.value
                            }
                          </TableCell>
                        ))}
                        <TableCell>
                          <OverflowMenu light flipped>
                            <OverflowMenuItem itemText="Edit" disabled />
                          </OverflowMenu>
                        </TableCell>
                      </TableExpandRow>
                      <TableExpandedRow
                        colSpan={headers.length + 3}
                        className="demo-expanded-td">
                        {row.cells.map((cell) => (
                          cell.info.header === "component_id" && cell.value.details.desc ?
                            <><h6>Description</h6><div>{cell.value.details.desc}</div></>
                            : cell.info.header === "component_id" && cell.value.details.configuration ?
                              <><h6>Configuration</h6><div>{cell.value.details.configuration}</div></>
                              : cell.info.header === "component_id" && cell.value.details.comment ?
                                <><h6>Comment</h6><div>{cell.value.details.comment}</div></>
                                :
                                <></>
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
