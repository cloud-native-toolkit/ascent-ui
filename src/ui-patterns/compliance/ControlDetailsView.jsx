import React, { Component } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tag,
  UnorderedList,
  ListItem,
  SearchSkeleton,
  ContentSwitcher,
  Switch,
  Pagination
} from 'carbon-components-react';
import {
  Link
} from "react-router-dom";
import MappingTable from "../mapping/MappingTable"
import { mappingHeaders as headers } from '../data/data';

class ControlDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      nistData: {},
      show: "fs-cloud-desc",
      mappingData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 10
    };
    this.loadTable = this.loadTable.bind(this);
  }

  async loadTable() {
    const mappingData = await this.props.mapping.getMappings({ where : {control_id: this.props.controlId}});
    this.setState({
      mappingData: mappingData,
      totalItems: mappingData.length
    });
  }

  async componentDidMount() {
    const controlData = await this.props.controls.getControlsDetails(this.props.controlId);
    const nistData = controlData.nist;
    this.setState({
      data: controlData,
      nistData: nistData
    });
    this.loadTable();
  }
  render() {
    const data = this.state.data;
    const nistData = this.state.nistData;
    const mappingData = this.state.mappingData;
    console.log(nistData);
    let breadcrumb;
    let title;
    let guidance = <></>;
    let comment = <></>;

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
            <Link to="/controls">Controls</Link>
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
                </div>
              </div>;
      if (data.guidance && data.guidance !== "None") {
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
    if (nistData.supplemental_guidance && nistData.supplemental_guidance.description) {
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
                      <Link to={"/nists/" + nistData.parent_control.toLowerCase().replace(' ', '_')} >
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
                      <Link to={"/nists/" + related.toLowerCase().replace(' ', '_')} >
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
    return (
        <div className="bx--grid">
          {breadcrumb}
          {title}

          {data.control_id && 
            <ContentSwitcher 
              light
              size='xl'
              onChange={(e) => {this.setState({show:e.name})}} >
              <Switch name="fs-cloud-desc" text="Description" />
              <Switch name="nist-desc" text="Additional NIST Information" />
            </ContentSwitcher>
          }
          

          {this.state.show === "fs-cloud-desc" && <div>
            {data.control_id && 
              <>
                <br />
                <h3>Description</h3>
                <br />
                <p>{data.control_description}</p>
                <br />
              </>
            }
            
            {guidance}
            {comment}
            <div className="bx--row">
              <div className="bx--col-lg-16">
                {mappingData.length > 0 &&
                  <>
                    <br />
                    <h3>Impacted Components</h3>
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
                      controlId={this.props.controlId}
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
          </div>}
          
          {this.state.show === "nist-desc" && <div>
            {nist}
            {family}
            {priority}
            {supplemental_guidance}
            {parent_control}
            {related}
            {baseline_impact}
            {references}
          </div>}
          
        </div >
    );
  }
}
export default ControlDetailsView;