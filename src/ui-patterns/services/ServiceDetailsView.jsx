import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  SearchSkeleton,
  InlineNotification,
  Pagination,
  UnorderedList, ListItem
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import MappingTable from "../mapping/MappingTable"
import {
  Launch16,
  WarningAlt16
} from '@carbon/icons-react';
import { mappingHeaders as headers } from '../data/data';

import {
  ToastNotification, ContentSwitcher, Switch
} from "carbon-components-react";

import ServiceDetails from './ServiceDetails';

class ServiceDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      automationData: false,
      show: false,
      showContent: "service-details",
      notif: false,
      mappingData: [],
      filterData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 15,
      notifications: []
    };
    this.loadTable = this.loadTable.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadTable() {
    const mappingData = await this.props.mapping.getMappings({ where: { service_id: this.props.serviceId }, include: ["profile", "control", "service"] });
    this.props.mapping.getMappings({ where: { service_id: this.props.serviceId }, include: ["profile", "goals", "control", "service"] }).then((mappings) => {
      this.setState({
        mappingData: mappings,
        filterData: mappings,
        totalItems: mappings.length
      });
    });
    this.setState({
      mappingData: [],
      filterData: [],
      totalItems: 0
    });
    this.setState({
      mappingData: mappingData,
      filterData: mappingData,
      totalItems: mappingData.length
    });
  }

  async filterTable(searchValue) {
      if (searchValue) {
          const filterData = this.state.mappingData.filter(elt => elt?.scc_profile?.includes(searchValue) || elt?.control_id?.includes(searchValue));
          this.setState({
              filterData: filterData,
              firstRowIndex: 0,
              totalItems: filterData.length
          });
      } else {
          this.setState({
              filterData: this.state.mappingData,
              firstRowIndex: 0,
              totalItems: this.state.mappingData.length
          });
      }
  }

  async componentDidMount() {
    const serviceData = await this.props.service.getServiceDetails(this.props.serviceId);
    let catalog = await this.props.service.getServiceCatalog(this.props.serviceId);
    serviceData.service = serviceData;
    serviceData.catalog = catalog;
    this.setState({
      data: serviceData
    });
    this.props.automationService.getAutomation(serviceData.cloud_automation_id).then((res) => {
      if (res && res.name) {
        let automationData = this.state.automationData;
        automationData = res;
        this.setState({
          automationData: automationData
        });
      }
    })
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
          severity: type || "info"
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
    const mappingData = this.state.filterData;
    let breadcrumb;
    let content;
    let title;
    let notif = this.state.notif;
    if (!data.service_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      title = <SearchSkeleton />;
      content = <></>;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/services">Services</Link>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      title = <div className="bx--row">
                <div className="bx--col-lg-12">
                  <br></br>
                  <h2 style={{ display: 'flex' }}>
                    {
                      data?.catalog?.overview_ui?.en ?
                        data.catalog.overview_ui.en.display_name
                        : data?.fullname || data.name
                    }
                    {
                      data?.fs_validated || data?.catalog?.tags?.includes("fs_ready")
                      ? <Tag type="green" style={{ marginLeft: "auto" }}>FS Validated</Tag>
                      : ["gitops","tools","ocp"].includes(data?.provider)
                      && <Tag style={{"background-color": "#F5606D", marginLeft: "auto"}}> OpenShift Software </Tag>
                    }
                  </h2>
                  <br></br>
                </div>
              </div>;
      content = <div className="bx--row">
        <div className="bx--col-lg-12">
          <br />
          <ServiceDetails data={data}/>
        </div>
      </div>;
    }
    return (
      <>
        <div class='notif'>
          {this.state.notifications.length !== 0 && this.renderNotifications()}
        </div>
        <div className="bx--grid">
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

          {breadcrumb}
          {title}

          {data.service_id && 
            <ContentSwitcher
              size='xl'
              onChange={(e) => {this.setState({showContent:e.name})}} >
              <Switch name="service-details" text="Description" />
              <Switch name="mapping" text="Impacting Controls" />
            </ContentSwitcher>
          }
          
          {this.state.showContent === "service-details" && 
            content
          }
          {data.service_id && this.state.showContent === "mapping" &&
            <>
              <br />
              <h3>Impacting Controls</h3>
              <br />
              <MappingTable
                toast={this.addNotification}
                data={mappingData}
                headers={headers}
                rows={mappingData.slice(
                  this.state.firstRowIndex,
                  this.state.firstRowIndex + this.state.currentPageSize
                )}
                handleReload={this.loadTable}
                mapping={this.props.mapping}
                controls={this.props.controls}
                services={this.props.service}
                arch={this.props.arch}
                serviceId={this.props.serviceId}
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
        </div >
      </>
    );
  }
}
export default ServiceDetailsView;