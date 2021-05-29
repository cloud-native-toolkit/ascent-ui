import React, { Component } from "react";
import {
  DataTableSkeleton,
  Pagination
} from 'carbon-components-react';
import MappingTable from './MappingTable';
import { mappingHeaders } from '../data/data';

import { ToastNotification } from "carbon-components-react";


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
    this.addNotification = this.addNotification.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadTable() {
    const mappingDetails = await this.props.mapping.getMappings({ include: ["profile", "control", "service"] });
    this.props.mapping.getMappings({ include: ["profile", "goals", "control", "service"] }).then((mappings) => {
      this.setState({
        data: mappings,
        filterData: mappings,
        totalItems: mappings.length
      });
    });
    this.setState({
      data: [],
      filterData: [],
      totalItems: 0
    });
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
          const filterData = this.state.data.filter(elt => elt?.scc_profile?.includes(searchValue) || elt?.control_id?.includes(searchValue) || elt?.service_id?.includes(searchValue) || elt?.service?.ibm_catalog_service?.includes(searchValue));
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
    const data = this.state.filterData;
    const headers = this.state.headerData;
    return (
      <>
        <div class='notif'>
          {this.state.notifications.length !== 0 && this.renderNotifications()}
        </div>
        <div className="bx--grid">
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h2 className="landing-page__subheading">
                Control Mapping
                          </h2>
              <br></br>
              <p>
                Mapping list showing the relationship between FS controls, IBM Cloud services and reference architectures for the FS Cloud.
              </p>
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
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
                    toast={this.addNotification}
                    headers={headers}
                    data={data}
                    rows={data.slice(
                      this.state.firstRowIndex,
                      this.state.firstRowIndex + this.state.currentPageSize
                    )}
                    handleReload={this.loadTable}
                    mapping={this.props.mapping}
                    controls={this.props.controls}
                    services={this.props.services}
                    arch={this.props.arch}
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
            </div>
          </div>
        </div >
      </>
    );

  }
}
export default MappingView;
