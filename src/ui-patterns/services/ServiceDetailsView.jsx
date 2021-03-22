import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  SearchSkeleton,
  InlineNotification,
  Pagination
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import MappingTable from "../mapping/MappingTable"
import { mappingHeaders as headers } from '../data/data';

class ServiceDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      show: false,
      notif: false,
      mappingData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 10
    };
    this.loadTable = this.loadTable.bind(this);
  }

  async loadTable() {
    const mappingData = await this.props.mapping.getMappings({ where : {service_id: this.props.serviceId}});
    this.setState({
      mappingData: mappingData,
      totalItems: mappingData.length
    });
  }
  
  async componentDidMount() {
    const serviceData = await this.props.service.getServiceDetails(this.props.serviceId);
    this.setState({
      data: serviceData
    });
    this.loadTable();
  }

  render() {
    const data = this.state.data;
    const mappingData = this.state.mappingData;
    let breadcrumb;
    let content;
    let notif = this.state.notif;
    if (!data.service_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      content = <SearchSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/services">Services</Link>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      content = <div className="bx--row">
        <div className="bx--col-lg-16">
          <br />
          <h2 className="landing-page__subheading" style={{ display: "flex" }}>
            {data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id}
          </h2>
          <br />
          {data.desc ? <div class="attribute"><p><span class="name">Description: </span> {data.desc}</p></div> : <></>}
          <div class="attribute"><p><span class="name">FS Cloud Certified: </span> {data.fs_certified ? <><Tag type="green">{data.compliance_status ? data.compliance_status : "true"}</Tag></> : <Tag type="red">false</Tag>}</p></div>
          {data.grouping ? <div class="attribute"><p><span class="name">Group: </span> <Tag type="blue">{data.grouping}</Tag></p></div> : <></>}
          {data.deployment_method ? <div class="attribute"><p><span class="name">Deployment Method: </span> <Tag type="blue">{data.deployment_method}</Tag></p></div> : <></>}
          {data.provision ? <div class="attribute"><p><span class="name">Provision: </span> <Tag type="blue">{data.provision}</Tag></p></div> : <></>}
          {data.cloud_automation_id ? <div class="attribute"><p><span class="name">Cloud Automation id: </span> <Tag type="blue">{data.cloud_automation_id}</Tag></p></div> : <></>}
          {data.hybrid_automation_id ? <div class="attribute"><p><span class="name">Hybrid Automation id: </span> <Tag type="blue">{data.hybrid_automation_id}</Tag></p></div> : <></>}
          <div className="bx--row">
            <div className="bx--col-lg-16">
              {mappingData.length === 0 ?
                <></>
                :
                <>
                  <br />
                  <h3>Impacting Controls</h3>
                  <br />
                  <MappingTable
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
        </div>
      </div>;
    }
    return (
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
        {content}
      </div >
    );
  }
}
export default ServiceDetailsView;