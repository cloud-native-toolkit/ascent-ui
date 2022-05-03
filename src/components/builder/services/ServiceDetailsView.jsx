import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  SearchSkeleton,
  Pagination,
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import MappingTable from "../../compliance/mapping/MappingTable"
import { mappingHeaders as headers } from '../../../data/data';

import {
  ContentSwitcher, Switch
} from "carbon-components-react";

import ServiceDetails from './ServiceDetails';
import NotFound from "../../NotFound";
import { getMappings } from '../../../services/mappings';
import { getServiceDetails, getServiceCatalog } from '../../../services/services';
import { getAutomation } from '../../../services/automation';

class ServiceDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      automationData: false,
      show: false,
      showContent: "service-details",
      mappingData: [],
      filterData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 15
    };
    this.loadTable = this.loadTable.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadTable() {
    const mappingData = await getMappings({ where: { service_id: this.props.serviceId }, include: ["profile", "control", "service"] });
    getMappings({ where: { service_id: this.props.serviceId }, include: ["profile", "goals", "control", "service"] }).then((mappings) => {
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
          const filterData = this.state.mappingData.filter(elt => elt?.scc_profile?.includes(searchValue) || elt?.control_id?.includes(searchValue));
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
    try {
      const serviceData = await getServiceDetails(this.props.serviceId);
      let catalog = await getServiceCatalog(this.props.serviceId);
      serviceData.service = serviceData;
      serviceData.catalog = catalog;
      this.setState({
        data: serviceData
      });
      getAutomation(serviceData.cloud_automation_id).then((res) => {
        if (res && res.name) {
          let automationData = this.state.automationData;
          automationData = res;
          this.setState({
            automationData: automationData
          });
        }
      })
      this.loadTable();
    } catch (error) {
      this.setState({
        error: error
      })
    }
  }

  render() {
    const data = this.state.data;
    const mappingData = this.state.filterData;
    let breadcrumb;
    let content;
    let title;
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
      this.state.error ?
        <NotFound />
      :
      <>
        <div className="bx--grid">

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
                toast={this.props.addNotification}
                data={mappingData}
                headers={headers}
                rows={mappingData.slice(
                  this.state.firstRowIndex,
                  this.state.firstRowIndex + this.state.currentPageSize
                )}
                handleReload={this.loadTable}
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