import React, { Component } from "react";
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  SearchSkeleton,
  InlineNotification,
  Link
} from 'carbon-components-react';
import MapControlToServiceModal from './MapControlToServiceModal';
import { Add16 } from '@carbon/icons-react';

class ServiceDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      show: false,
      notif: false,
      controlsData: {}
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  async componentDidMount() {
    const serviceData = await this.props.service.getServiceDetails(this.props.serviceId);
    const controlsData = serviceData.controls;
    this.setState({
      data: serviceData,
      controlsData: controlsData
    });
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = (res) => {
    let notif = false;
    console.log(res)
    if (res && res.service_id && res.control_id) {
      notif = {
        kind: "success",
        title: "Success",
        message: `Control ${res.control_id} successfully mapped to service ${res.service_id}`
      }
    }
    this.setState(
      { 
        show: false,
        notif: notif
      }
    );
    this.componentDidMount();
  };

  render() {
    const data = this.state.data;
    const controlsData = this.state.controlsData;
    let breadcrumb;
    let content;
    let showModal = this.state.show;
    let notif = this.state.notif;
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
          <BreadcrumbItem href="#">{data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      content = <div className="bx--row">
        <div className="bx--col-lg-16">
          <br />
          <h2 className="landing-page__subheading" style={{ display: "flex" }}>
            {data.ibm_catalog_service ? data.ibm_catalog_service : data.service_id}
            <Button class="right" renderIcon={Add16} iconDescription="Add" onClick={this.showModal} style={{ marginLeft: "auto" }}>Add Impacting Control</Button>
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
      <>
        <div>
          {
            showModal &&
            <MapControlToServiceModal show={this.state.show} handleClose={this.hideModal} service={this.props.service} controls={this.props.controls} serviceId={this.props.serviceId} isUpdate={this.state.isUpdate} data={this.state.mappingRecord} />
          }
        </div >
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
      </>
    );
  }
}
export default ServiceDetailsView;