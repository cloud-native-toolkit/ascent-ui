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
  OverflowMenuItem
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import MappingModal from "./MappingModal"

class MappingTable extends Component {
  constructor(props) {
      super(props);
      this.state = {
        show: false
      };
      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };


  render() {
    const showModal = this.state.show;
    for (let index = 0; index < this.props.rows.length; index++) {
      let row = this.props.rows[index];
      row.component_id = {
        val: row.service_id || row.arch_id,
        arch: row.arch_id ? true: false,
        service: row.service_id ? true: false,
        details: {
          desc: row.desc,
          configuration: row.configuration,
          comment: row.comment
        }
      }
    }
    console.log(this.props.rows)
    return (
      <>
      <div>
        {showModal &&
            <MappingModal 
              show={this.state.show}
              handleClose={this.hideModal}
              isUpdate={this.state.isUpdate}
              mapping={this.props.mapping}
              controls={this.props.controls}
              services={this.props.services}
              arch={this.props.arch} />
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
        }) => (
          <TableContainer
            {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()} aria-label="data table toolbar">
              <TableToolbarContent>
                <TableToolbarSearch onChange={onInputChange} />
                <Button
                  size="small"
                  kind="primary"
                  onClick={this.showModal}>Add
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableExpandHeader />
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
                        <OverflowMenuItem itemText="Edit" />
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
