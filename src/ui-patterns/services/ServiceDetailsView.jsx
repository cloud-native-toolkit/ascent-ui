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
    let title;
    let controls = <></>;
    if (!data.service_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      title = <SearchSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <a href="/services">Services</a>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{this.props.serviceId}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      title = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h2 className="landing-page__subheading">
                    {data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id} 
                    {data.fs_certified ? <><Tag type="green">FS certified: {data.compliance_status}</Tag></> : <></>}
                    {data.deployment_method ? <><Tag type="blue">{data.deployment_method}</Tag></> : <></>}
                    {data.provision ? <><Tag type="blue">{data.provision}</Tag></> : <></>}
                    {data.provision ? <><Tag type="blue">{data.provision}</Tag></> : <></>}
                  </h2>
                  <br></br>
                  {data.desc}
                  <br></br>
                </div>
              </div>;
      if (controlsData && controlsData.length > 0) {
        controls = <>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h3 className="landing-page__subheading">Impacting FS Cloud Controls</h3>
              <br></br>
              {controlsData.map((control) => (
                <Tag type="blue">
                  <Link href={"/control/" + control.control_id.toLowerCase().replace(' ', '_')} >
                    {control.control_id}
                  </Link>
                </Tag>
              ))}
              <br></br>
            </div>
          </div>
        </>
      }
    }
    return (
        <div className="bx--grid">
          {breadcrumb}
          {title}
          {controls}
        </div >
    );
  }
}
export default ServiceDetailsView;