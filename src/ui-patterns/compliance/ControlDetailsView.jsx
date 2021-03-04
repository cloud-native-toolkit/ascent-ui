import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  TagSkeleton,
  Link
} from 'carbon-components-react';

class ControlDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      nistData: {},
      servicesData: {},
      architecturesData: {},
    };
  }

  async componentDidMount() {
    console.log(this.props.controlId)
    const controlData = await this.props.controls.getControlsDetails(this.props.controlId);
    const nistData = controlData.nist;
    const servicesData = controlData.services;
    const architecturesData = controlData.architectures;
    this.setState({
      data: controlData,
      nistData: nistData,
      servicesData: servicesData,
      architecturesData: architecturesData
    });
  }
  render() {
    const data = this.state.data;
    const nistData = this.state.nistData;
    const servicesData = this.state.servicesData;
    const architecturesData = this.state.architecturesData;
    let breadcrumb;
    let services;
    let architectures;
    if (!data.control_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      services = <TagSkeleton />;
      architectures = <TagSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <a href="/controls">Controls</a>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{this.props.controlId}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      services = servicesData.map((service) => (
        <Tag>{service.service_id}</Tag>
      ));
      architectures = architecturesData.map((arch) => (
        <Tag>{arch.arch_id}</Tag>
      ));
    }
    return (
        <div className="bx--grid">
          {breadcrumb}
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h2 className="landing-page__subheading">
                {data.control_id}
              </h2>
              <br></br>
              <p>
                {data.control_description}
              </p>
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h3 className="landing-page__subheading">Guidance</h3>
              <br></br>
              <p>
                {data.guidance}
              </p>
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h3 className="landing-page__subheading">Comment</h3>
              <br></br>
              <p>
                {data.comment}
              </p>
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h3 className="landing-page__subheading">Impacted services</h3>
              <br></br>
              {services}
              <br></br>
            </div>
          </div>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h3 className="landing-page__subheading">Impacted Architecture References</h3>
              <br></br>
              {architectures}
              <br></br>
            </div>
          </div>
        </div >
    );
  }
}
export default ControlDetailsView;