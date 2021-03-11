import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  SearchSkeleton,
  Link
} from 'carbon-components-react';

class ServiceDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      controlsData: {}
    };
  }

  async componentDidMount() {
    const serviceData = await this.props.service.getServiceDetails(this.props.serviceId);
    const controlsData = serviceData.controls;
    this.setState({
      data: serviceData,
      controlsData: controlsData
    });
  }
  render() {
    const data = this.state.data;
    const controlsData = this.state.controlsData;
    let breadcrumb;
    let content;
    let controls = <></>;
    if (!data.service_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      content = <SearchSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <a href="/services">Services</a>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{data.desc ? data.desc : data.service_id}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      content = <div className="bx--row">
        <div className="bx--col-lg-16">
          <br />
          <h2 className="landing-page__subheading">
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
          {controlsData && controlsData.length > 0 ? <div class="attribute"><p><span class="name">Impacting FS Cloud Controls: </span> {controlsData.map((control) => (
            <Tag type="blue">
              <Link href={"/control/" + control.control_id.toLowerCase().replace(' ', '_')} >
                {control.control_id}
              </Link>
            </Tag>
          ))}</p></div> : <></>}
        </div>
      </div>;
    }
    return (
      <div className="bx--grid">
        {breadcrumb}
        {content}
      </div >
    );
  }
}
export default ServiceDetailsView;