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
      headerData: mappingHeaders,
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 10,
      notifications: []
    };
    this.loadTable = this.loadTable.bind(this);
    this.addNotification = this.addNotification.bind(this);
  }

  async loadTable() {
    const mappingDetails = await this.props.mapping.getMappings();
    this.setState({
      data: [],
      totalItems: 0
    });
    this.setState({
      data: mappingDetails,
      totalItems: mappingDetails.length
    });
  }
  async componentDidMount() {
    this.loadTable();
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
    const data = this.state.data;
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
                Mapping list showing the relationship between FS controls, IMB Cloud services and reference architectures for the FS Cloud.
              </p>
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              {data.length === 0 ?
                <DataTableSkeleton
                  columnCount={headers.length + 1}
                  rowCount={10}
                  headers={headers}
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
