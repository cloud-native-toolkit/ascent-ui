import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  UnorderedList,
  ListItem,
  SearchSkeleton
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";

class NistDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nistData: {}
    };
  }

  async componentDidMount() {
    const nistData = await this.props.nist.getNistDetails(this.props.number);
    this.setState({
      nistData: nistData
    });
  }
  async componentDidUpdate() {
    const nistData = await this.props.nist.getNistDetails(this.props.number);
    this.setState({
      nistData: nistData
    });
  }
  render() {
    const nistData = this.state.nistData;
    let breadcrumb;
    let title;
    let family = <></>;
    let priority = <></>;
    let supplemental_guidance = <></>;
    let parent_control = <></>;
    let related = <></>;
    let baseline_impact = <></>;
    let references = <></>;
    if (!nistData.number) {
      breadcrumb = <BreadcrumbSkeleton />;
      title = <SearchSkeleton />;
    } else {
      breadcrumb = <>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to="/nist-controls">NIST controls</Link>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{this.props.number}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      title = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h2 className="landing-page__subheading">
                    {nistData.number}
                  </h2>
                  <br></br>
                  <h3 className="landing-page__subheading">{nistData.title.toLowerCase()}</h3>
                  <br></br>
                  <p>{nistData.statement.description}</p>
                  {nistData.statement.statement ? <>
                        <UnorderedList>
                          {nistData.statement.statement.map((statement) => (
                            <ListItem>
                              <p>{statement.description}</p>
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </> : <></>}
                  <br></br>
                </div>
              </div>;
      if (nistData.family) {
        family = <div className="bx--row">
                  <div className="bx--col-lg-16">
                    <br></br>
                    <h3 className="landing-page__subheading">Family</h3>
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
                    <h3 className="landing-page__subheading">Priority</h3>
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
                    <h3 className="landing-page__subheading">Supplemental Guidance</h3>
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
                    <h3 className="landing-page__subheading">Parent Control</h3>
                    <br></br>
                      <Tag type="blue">
                        <Link to={"/nist/" + nistData.parent_control.toLowerCase().replace(' ', '_')} >
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
                    <h3 className="landing-page__subheading">Related NIST Controls</h3>
                    <br></br>
                    {nistData.supplemental_guidance.related.map((related) => (
                      <Tag type="blue">
                        <Link to={"/nist/" + related.toLowerCase().replace(' ', '_')} >
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
                    <h3 className="landing-page__subheading">Baseline Impact</h3>
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
                    <h3 className="landing-page__subheading">References</h3>
                    <br></br>
                    <UnorderedList>
                    {nistData.references.reference.map((ref) => (
                      <ListItem>
                        <a href={ref.item["@href"]} target="_blank">
                          {ref.item["#text"]}
                        </a>
                      </ListItem>
                    ))}
                    </UnorderedList>
                    <br></br>
                  </div>
                </div>;
      }
    }
    return (
        <div className="bx--grid">
          {breadcrumb}
          {title}
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
export default NistDetailsView;