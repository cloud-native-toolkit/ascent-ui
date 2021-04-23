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
import ReactMarkdown from 'react-markdown';
import {
  Link
} from "react-router-dom";
import {
  Launch16
} from '@carbon/icons-react';
import MappingTable from "../mapping/MappingTable"
import { mappingHeaders as headers } from '../data/data';

import { ToastNotification } from "carbon-components-react";

class ControlDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      nistData: {},
      show: "fs-cloud-desc",
      mappingData: [],
      filterData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 10,
      notifications: []
    };
    this.loadTable = this.loadTable.bind(this);
    this.addNotification = this.addNotification.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadControl(controlId) {
    const controlData = await this.props.controls.getControlsDetails(controlId);
    controlData.description = controlData.description.replaceAll(/\n\n([a-z]\))/gi, '\n\n**$1**');
    controlData.implementation = controlData.implementation.replaceAll('\n\n#### Part', '\n\n&nbsp;  \n#### Part');
    controlData.implementation = controlData.implementation.replaceAll('\n\n#####', '\n\n&nbsp;  \n#####');
    const nistData = controlData.nist;
    this.setState({
      data: controlData,
      nistData: nistData
    });
  }

  async loadTable() {
    console.log(this.props.controlId);
    const mappingData = await this.props.mapping.getMappings({ where : {control_id: this.props.controlId}, include: ["profile", "control", "service"] });
    this.props.mapping.getMappings({ where : {control_id: this.props.controlId}, include: ["profile", "goals", "control", "service"] }).then((mappings) => {
      this.setState({
        mappingData: mappings,
        filterData: mappings,
        totalItems: mappings.length
      });
    });
    this.setState({
      mappingData: [],
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
          const filterData = this.state.mappingData.filter(elt => elt?.scc_profile?.includes(searchValue) || elt.service_id?.includes(searchValue) || elt?.service?.ibm_catalog_service?.includes(searchValue));
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
    this.loadControl(this.props.controlId);
    this.loadTable();
  }

  async componentWillReceiveProps(newProps){
    if (newProps.controlId && newProps.controlId !== this.state.controlId) {
      this.loadControl(newProps.controlId);
    }
  }

  /** Notifications */

  addNotification(type, message, detail) {
    this.setState(prevState => ({
      notifications: [
        ...prevState.notifications,
        {
          message: message || "Notification",
          detail: detail || "Notification text",
          severity: type || "info"
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
    const nistData = this.state.nistData;
    const mappingData = this.state.filterData;
    let breadcrumb;
    let title;
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
    if (!data.id) {
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
                  <h2>
                    {(data.name && (data.id + ": " + data.name)) || data.id}
                  </h2>
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.number) {
      nist = <div className="bx--row">
              <div className="bx--col-lg-16">
                <br></br>
                <h3 >
                  Official NIST description
                </h3>
                <br></br>
                <h4 >{nistData.title && nistData.title.toLowerCase()}</h4>
                <br></br>
                <p>{nistData.statement && nistData.statement.description}</p>
                {nistData.statement && nistData.statement.statement ? <>
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
                  <h4 >Family</h4>
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
                  <h4 >Priority</h4>
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
                  <h4 >Supplemental Guidance</h4>
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
                  <h4 >Parent Control</h4>
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
                  <h4 >Related NIST Controls</h4>
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
                  <h4 >Baseline Impact</h4>
                  <br></br>
                  {nistData.baseline_impact.map((baselineImpact) => (
                    <Tag type="cyan">{baselineImpact}</Tag>
                  ))}
                  <br></br>
                </div>
              </div>;
    }
    if (nistData.references && nistData.references.reference) {
      references = <div className="bx--row">
                <div className="bx--col-lg-16">
                  <br></br>
                  <h4 >References</h4>
                  <br></br>
                  <UnorderedList>
                  {nistData.references.reference.map((ref) => (
                    <ListItem>
                      <a href={ref.item["@href"]} target="_blank">
                        {ref.item["#text"]}
                        <Launch16 style={{"margin-left": "5px"}}/>
                      </a>
                    </ListItem>
                  ))}
                  </UnorderedList>
                  <br></br>
                </div>
              </div>;
    }
    return (
      <>
        <div class='notif'>
          {this.state.notifications.length !== 0 && this.renderNotifications()}
        </div>
        <div className="bx--grid">
          {breadcrumb}
          {title}

          {data.id && 
            <ContentSwitcher
              size='xl'
              onChange={(e) => {this.setState({show:e.name})}} >
              <Switch name="fs-cloud-desc" text="Description" />
              <Switch name="nist-desc" text="Additional NIST Information" />
              <Switch name="mapping" text="Impacted Components" />
            </ContentSwitcher>
          }
          

          {this.state.show === "fs-cloud-desc" && <div>
            {data.id && 
              <>
                <br />
                <h3>Description</h3>
                <br />
                <ReactMarkdown>{data.description}</ReactMarkdown>
                {data.parent_control && <>
                  <br />
                  <p>Parent control: <Tag type="blue">
                      <Link to={"/controls/" + data.parent_control.toLowerCase().replace(' ', '_')} >
                        {data.parent_control}
                      </Link>
                    </Tag></p>
                </>}
                <br />
                {data.parameters && <>
                  <h3>Parameters</h3>
                  <br />
                  <ReactMarkdown>{data.parameters}</ReactMarkdown>
                  <br />
                </>}
                <h3>Solution and Implementation</h3>
                <br />
                <ReactMarkdown>{data.implementation}</ReactMarkdown>
                <br />
              </>
            }
            
            {comment}
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
          
          {this.state.show === "mapping" && <div>
            {data.id &&
              <>
                <br />
                <h3>Impacted Components</h3>
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
                  controlId={this.props.controlId}
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
          </div>}
          
        </div >
      </>
    );
  }
}
export default ControlDetailsView;