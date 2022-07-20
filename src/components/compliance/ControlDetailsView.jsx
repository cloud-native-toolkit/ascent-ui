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
  Pagination,
  Grid, Row, Column
} from 'carbon-addons-iot-react/node_modules/carbon-components-react';
import {
  Link
} from "react-router-dom";
import {
  Launch16
} from '@carbon/icons-react';

import ReactGA from 'react-ga4';

import MappingTable from "./mapping/MappingTable"
import ControlDetails from './ControlDetails';
import {
  mappingHeaders as headers
} from '../../data/data';
import NotFound from "../NotFound";
import { getMappings } from "../../services/mappings";
import { getControlDetails } from "../../services/controls";

class ControlDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      controlId: this.props.controlId,
      user: undefined,
      loadControl: false,
      data: {},
      nistData: {},
      show: "",
      mappingData: [],
      filterData: [],
      totalItems: 0,
      firstRowIndex: 0,
      currentPageSize: 15,
    };
    this.loadTable = this.loadTable.bind(this);
    this.filterTable = this.filterTable.bind(this);
  }

  async loadControl(controlId) {
    let filter = {
      include: ['nist', 'services', 'architectures']
    }
    if (this.state.user?.roles?.includes("fs-viewer")) filter = {
      include: ['controlDetails', 'nist', 'services', 'architectures']
    }
    let controlData = null;
    try {
      controlData = await getControlDetails(controlId, filter);
    } catch (error) {
      this.props.addNotification('error', 'Error', 'Error fetching control details.');
    }
    if (controlData.id) {
      if (controlData?.controlDetails?.description) controlData.controlDetails.description = controlData.controlDetails.description.replaceAll(/\n\n([a-z]\))/gi, '\n\n**$1**');
      if (controlData?.controlDetails?.implementation) controlData.controlDetails.implementation = controlData.controlDetails.implementation.replaceAll('\n\n#### Part', '\n\n&nbsp;  \n#### Part');
      if (controlData?.controlDetails?.implementation) controlData.controlDetails.implementation = controlData.controlDetails.implementation.replaceAll('\n\n#####', '\n\n&nbsp;  \n#####');
      const nistData = controlData.nist;
      this.setState({
        data: controlData,
        nistData: nistData
      });
    } else {
      this.setState({
        error: controlData
      });
    }
  }

  async loadTable() {
    let mappingData = [];
    try {
      mappingData = await getMappings({ where: { control_id: this.props.controlId }, include: ["profile", "control", "service"] });
    } catch (error) {
      this.props.addNotification('error', `${error.statusCode ? `${error.statusCode} ${error.name}` : 'Error'}`, `${error.message ? `${error.message}` : 'Error fetching mapping data.'}`);
    }
    getMappings({ where: { control_id: this.props.controlId }, include: ["profile", "goals", "control", "service"] }, this.props.addNotification)
      .then((mappings) => {
        this.setState({
          mappingData: mappings,
          filterData: mappings,
          totalItems: mappings.length
        })
      })
      .catch(console.error);
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
      const filterData = this.state.mappingData.filter(elt => elt?.scc_profile?.includes(searchValue) || elt?.service_id?.includes(searchValue) || elt?.service?.ibm_catalog_service?.includes(searchValue));
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
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    if (!this.state.loadControl && this.state.user) {
      await this.setState({ loadControl: true });
      this.loadControl(this.props.controlId);
      this.loadTable();
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user !== prevState.user) {
      return ({ user: nextProps.user,
        show: nextProps.user?.roles?.includes("fs-viewer") ? "fs-cloud-desc" : "nist-desc"
      });
    }
    return null
  }

  async componentDidUpdate() {
    if (this.props.controlId !== this.state.controlId) {
      this.setState({ controlId: this.props.controlId })
      this.loadControl(this.props.controlId);
    }
    if (!this.state.loadControl && this.state.user) {
      await this.setState({ loadControl: true });
      this.loadControl(this.props.controlId);
      this.loadTable();
    }
  }


  render() {
    const data = this.state.data;
    const nistData = this.state.nistData;
    const mappingData = this.state.filterData;

    return (
      this.state.error ?
        <NotFound />
      :
      <>
        <Grid>

          {data.id ?
            <Breadcrumb>
              <BreadcrumbItem>
                {this.state.user?.roles?.includes("fs-viewer") ?
                  <Link to="/controls">Controls</Link>
                  :
                  <Link to="/nists">NIST</Link>
                }
              </BreadcrumbItem>
              <BreadcrumbItem href="#">{this.props.controlId}</BreadcrumbItem>
            </Breadcrumb>
            :
            <BreadcrumbSkeleton />
          }

          {data.id ?
            <Row>
              <Column lg={{span: 12}}>
                <h2>
                  {(data.name && (data.id + ": " + data.name)) || data.id}
                </h2>
              </Column>
            </Row>
            :
            <SearchSkeleton />
          }

          {data.id &&
            <ContentSwitcher
              size='xl'
              onChange={(e) => { this.setState({ show: e.name }) }} >
              {this.state.user?.roles?.includes("fs-viewer") ? <Switch name="fs-cloud-desc" text="Description" /> : <></>}
              <Switch className={this.state.show === "nist-desc" && !this.state.user?.roles?.includes("fs-viewer") ? "bx--content-switcher--selected" : ""} name="nist-desc" text="Additional NIST Information" />
              <Switch name="mapping" text="Impacted Components" />
            </ContentSwitcher>
          }

          <div className="control-details">
            {data?.controlDetails && this.state.show === "fs-cloud-desc" && <div>
              {data.id && <ControlDetails data={data} />}
            </div>}

            {this.state.show === "nist-desc" && <div>
              { /* NIST Description */
                nistData.number && <Row>
                  <Column lg={{span: 12}}>
                    <h3 >
                      Official NIST description
                    </h3>
                    <h4 >{nistData.title && nistData.title.toLowerCase()}</h4>
                    <p>{nistData.statement && nistData.statement.description}</p>
                    {nistData.statement && nistData.statement.statement ? <>
                      <UnorderedList>
                        {nistData.statement.statement.map((statement) => (
                          <ListItem key={statement.description}>
                            <p>{statement.description}</p>
                          </ListItem>
                        ))}
                      </UnorderedList>
                    </> : <></>}
                  </Column>
                </Row>
              }
              { /* NIST Family */
                nistData.family && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Family</h4>
                    <p>
                      {nistData.family.toLowerCase() + '.'}
                    </p>
                  </Column>
                </Row>
              }
              { /* NIST Priority */
                nistData.priority && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Priority</h4>
                    <Tag type="red">{nistData.priority}</Tag>
                  </Column>
                </Row>
              }
              { /* NIST Supplemental Guidance */
                nistData?.supplemental_guidance?.description && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Supplemental Guidance</h4>
                    <p>
                      {nistData.supplemental_guidance.description}
                    </p>
                  </Column>
                </Row>
              }
              { /* NIST Parent Control */
                nistData?.parent_control && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Parent Control</h4>
                    <Tag type="blue">
                      <Link to={"/nists/" + nistData.parent_control.toLowerCase().replace(' ', '_')} >
                        {nistData.parent_control}
                      </Link>
                    </Tag>
                  </Column>
                </Row>
              }
              { /* NIST Related Controls */
                nistData?.supplemental_guidance?.related && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Related NIST Controls</h4>
                    {nistData.supplemental_guidance.related.map((related) => (
                      <Tag type="blue">
                        <Link to={"/nists/" + related.toLowerCase().replace(' ', '_')} >
                          {related}
                        </Link>
                      </Tag>
                    ))}
                  </Column>
                </Row>
              }
              { /* NIST Baseline Impact */
                nistData?.baseline_impact && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >Baseline Impact</h4>
                    {nistData.baseline_impact.map((baselineImpact) => (
                      <Tag type="cyan">{baselineImpact}</Tag>
                    ))}
                  </Column>
                </Row>
              }
              { /* NIST References */
                nistData?.references?.reference && <Row>
                  <Column lg={{span: 12}}>
                    <h4 >References</h4>
                    <UnorderedList>
                      {nistData.references.reference.map((ref) => (
                        <ListItem>
                          <a href={ref.item["@href"]} target="_blank" rel="noopener noreferrer">
                            {ref.item["#text"]}
                            <Launch16 style={{ "marginLeft": "5px" }} />
                          </a>
                        </ListItem>
                      ))}
                    </UnorderedList>
                  </Column>
                </Row>
              }
            </div>}

            {this.state.show === "mapping" && <div>
              {data.id &&
                <>
                  <h3>Impacted Components</h3>
                  <MappingTable
                    user={this.props.user}
                    toast={this.props.addNotification}
                    data={mappingData}
                    headers={headers}
                    rows={mappingData.slice(
                      this.state.firstRowIndex,
                      this.state.firstRowIndex + this.state.currentPageSize
                    )}
                    handleReload={this.loadTable}
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
          </div>

        </Grid >
      </>
    );
  }
}

export default ControlDetailsView;