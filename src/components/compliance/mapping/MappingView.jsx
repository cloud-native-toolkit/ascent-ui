import React, { Component } from "react";
import {
  DataTableSkeleton, Pagination, Grid, Row, Column
} from 'carbon-components-react';
import MappingTable from './MappingTable';

import { mappingHeaders } from '../../../data/data';
import { getMappings } from "../../../services/mappings";


class MappingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      filterData: [],
      headerData: mappingHeaders,
      totalItems: -1,
      firstRowIndex: 0,
      currentPageSize: 15,
      notifications: []
    };
    this.loadTable = this.loadTable.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadTable() {
    this.setState({
      data: [],
      filterData: [],
      totalItems: -1
    });
    let mappingDetails = [];
    try {
      mappingDetails = await getMappings({ include: ['profile', "control", "service"] });
    } catch (error) {
      this.props.addNotification('error', `${error.statusCode ? `${error.statusCode} ${error.name}` : 'Error'}`, `${error.message ? `${error.message}` : 'Error fetching mapping data.'}`);
    }
    mappingDetails = mappingDetails.sort((a, b) => b?.profile?.createdAt - a?.profile?.createdAt);
   getMappings({ include: ['profile', "goals", "control", "service"] })
      .then((mappings) => {
        mappings = mappings.sort((a, b) => b?.profile?.createdAt - a?.profile?.createdAt)
        this.setState({
          data: mappings,
          filterData: mappings,
          totalItems: mappings.length
        });
      })
      .catch(console.error);
    this.setState({
      data: mappingDetails,
      filterData: mappingDetails,
      totalItems: mappingDetails.length
    });
  }
  async componentDidMount() {
    this.loadTable();
  }

  async filterTable(searchValue) {
      if (searchValue) {
          const filterData = this.state.data.filter(elt => elt?.scc_profile?.includes(searchValue) || elt?.control_id?.includes(searchValue) || elt?.service_id?.includes(searchValue) || elt?.service?.ibm_catalog_service?.includes(searchValue));
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

  render() {
    const data = this.state.filterData;
    const headers = this.state.headerData;
    return (
      <Grid>
        <Row className="compliance-page__row">
          <Column lg={{span: 12}}>
            <h2>Control Mapping</h2>
            <p>
              Mapping list showing the relationship between FS controls, cloud services and reference architectures for the FS Cloud.
            </p>
            <br></br>
          </Column>
        </Row>
        <Row className="compliance-page__row">
          <Column lg={{span: 12}}>
            {this.state.totalItems < 0 ?
              <DataTableSkeleton
                columnCount={headers.length + 1}
                rowCount={15}
                showHeader={false}
                headers={null}
              />
              :
              <>
                <MappingTable
                  user={this.props.user}
                  toast={this.props.addNotification}
                  headers={headers}
                  data={data}
                  rows={data.slice(
                    this.state.firstRowIndex,
                    this.state.firstRowIndex + this.state.currentPageSize
                  )}
                  handleReload={this.loadTable}
                  filterTable={this.filterTable}
                />
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
                  }}
                />
              </>
            }
          </Column>
        </Row>
      </Grid >
    );

  }
}
export default MappingView;
