import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  UnorderedList,
  ListItem,
  SearchSkeleton,
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
    console.log(nistData);
    let breadcrumb;
    let title;
    let guidance = <></>;
    let comment = <></>;
    let services = <></>;
    let architectures = <></>;

    // NIST controls details
    let nist = <></>;
    let family = <></>;
    let priority = <></>;
    let supplemental_guidance = <></>;
    let parent_control = <></>;
    let related = <></>;
    let baseline_impact = <></>;
    let references = <></>;
    if (!data.control_id) {
      breadcrumb = <BreadcrumbSkeleton />;
      title = <SearchSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <a href="/controls">Controls</a>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{this.props.controlId}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      title = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h2 className="landing-page__subheading">
                    {data.control_id}
                  </h2>
                  <br></br>
                  {data.control_description}
                  <br></br>
                </div>
              </div>;
      if (data.guidance) {
        guidance = <div className="bx--row">
                  <div className="bx--col-lg-16">
                    <br></br>
                    <h4 className="landing-page__subheading">Guidance</h4>
                    <br></br>
                    <p>
                      {data.guidance}
                    </p>
                    <br></br>
                  </div>
                </div>;
      }
      if (data.comment) {
        comment = <div className="bx--row">
                    <div className="bx--col-lg-16">
                      <br></br>
                      <h4 className="landing-page__subheading">Comment</h4>
                      <br></br>
                      <p>
                        {data.comment}
                      </p>
                      <br></br>
                    </div>
                  </div>;
      }
      if (servicesData.length > 0) {
        services = <>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h4 className="landing-page__subheading">Impacted services</h4>
              <br></br>
              {servicesData.map((service) => (
                <Tag type="blue">{service.service_id}</Tag>
              ))}
              <br></br>
            </div>
          </div>
        </>
      }
      if (architecturesData.length > 0) {
        architectures = <>
          <div className="bx--row">
            <div className="bx--col-lg-16">
              <br></br>
              <h4 className="landing-page__subheading">Impacted reference architectures</h4>
              <br></br>
              {architecturesData.map((arch) => (
                <Tag type="blue">{arch.arch_id}</Tag>
              ))}
              <br></br>
            </div>
          </div>
        </>
      }
    }
    if (nistData.number) {
      nist = <div className="bx--row">
              <div className="bx--col-lg-16">
                <br></br>
                <h3 className="landing-page__subheading">
                  Official NIST description
                </h3>
                <br></br>
                <h4 className="landing-page__subheading">{nistData.title.toLowerCase()}</h4>
                <br></br>
                {nistData.statement.description}
                {nistData.statement.statement ? <>
                      <UnorderedList>
                        {nistData.statement.statement.map((statement) => (
                          <ListItem>
                            {statement.description}
                          </ListItem>
                        ))}
                      </UnorderedList>
                    </> : <></>}
                <br></br>
              </div>
            </div>;
    }
    if (nistData.family) {
      family = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Family</h4>
                  <br></br>
                  <p>
                    {nistData.family.toLowerCase() + '.'}
                  </p>
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.priority) {
      priority = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Priority</h4>
                  <br></br>
                  <Tag type="red">{nistData.priority}</Tag>
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.supplemental_guidance) {
      supplemental_guidance = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Supplemental Guidance</h4>
                  <br></br>
                  <p>
                    {nistData.supplemental_guidance.description}
                  </p>
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.parent_control) {
      parent_control = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Parent Control</h4>
                  <br></br>
                    <Tag type="blue">
                      <Link href={"/nist/" + nistData.parent_control.toLowerCase().replace(' ', '_')} >
                        {nistData.parent_control}
                      </Link>
                    </Tag>
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.supplemental_guidance && nistData.supplemental_guidance.related) {
      related = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Related NIST Controls</h4>
                  <br></br>
                  {nistData.supplemental_guidance.related.map((related) => (
                    <Tag type="blue">
                      <Link href={"/nist/" + related.toLowerCase().replace(' ', '_')} >
                        {related}
                      </Link>
                    </Tag>
                  ))}
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.baseline_impact) {
      baseline_impact = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">Baseline Impact</h4>
                  <br></br>
                  {nistData.baseline_impact.map((baselineImpact) => (
                    <Tag type="cyan">{baselineImpact}</Tag>
                  ))}
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.references) {
      references = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 className="landing-page__subheading">References</h4>
                  <br></br>
                  <UnorderedList>
                  {nistData.references.reference.map((ref) => (
                    <ListItem>
                      <Link href={ref.item["@href"]}>
                        {ref.item["#text"]}
                      </Link>
                    </ListItem>
                  ))}
                  </UnorderedList>
                  <br></br>
                </div>
              </div>;
    }
    return (
        <div className="bx--grid">
          {breadcrumb}
          {title}
          {guidance}
          {comment}
          {services}
          {architectures}
          {nist}
          {family}
          {priority}
          {supplemental_guidance}
          {parent_control}
          {related}
          {baseline_impact}
          {references}
        </div >
    );
  }
}
export default ControlDetailsView;