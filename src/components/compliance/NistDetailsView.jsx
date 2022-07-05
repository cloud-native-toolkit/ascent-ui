import React, { Component } from "react";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbSkeleton, Tag, UnorderedList,
  ListItem, SearchSkeleton, Grid, Row, Column
} from 'carbon-components-react';
import {
  Launch16
} from '@carbon/icons-react';
import {
  Link
} from "react-router-dom";

import ReactGA from 'react-ga4';

import NotFound from "../../components/NotFound";
import { getNistDetails } from "../../services/nist";


class NistDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nistData: {},
      number: undefined
    };
  }
  async loadNist(number) {
    try {
      const nistData = await getNistDetails(number);
      if (nistData.error) throw nistData.error;
      this.setState({
        nistData: nistData,
        number: this.props.number
      });
    } catch (error) {
      this.setState({
        error: error
      });
    }
  }
  async componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    this.loadNist(this.props.number);
  }
  async componentDidUpdate() {
    if (this.props.number !== this.state.number) {
      this.setState({ number: this.props.number });
      this.loadNist(this.props.number);
    }
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
            <Link to="/nists">NIST controls</Link>
          </BreadcrumbItem>
          <BreadcrumbItem href="#">{this.props.number}</BreadcrumbItem>
        </Breadcrumb>
      </>;
      title = <Row>
        <Column lg={{span: 12}}>
          <br></br>
          <h2>
            {nistData.number}
          </h2>
          <br></br>
          <h3 >{nistData.title && nistData.title.toLowerCase()}</h3>
          <br></br>
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
          <br></br>
        </Column>
      </Row>;
      if (nistData.family) {
        family = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Family</h3>
            <br></br>
            <p>
              {nistData.family.toLowerCase() + '.'}
            </p>
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.priority) {
        priority = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Priority</h3>
            <br></br>
            <Tag type="red">{nistData.priority}</Tag>
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.supplemental_guidance) {
        supplemental_guidance = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Supplemental Guidance</h3>
            <br></br>
            <p>
              {nistData.supplemental_guidance.description}
            </p>
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.parent_control) {
        parent_control = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Parent Control</h3>
            <br></br>
            <Tag type="blue">
              <Link to={"/nists/" + nistData.parent_control.toLowerCase().replace(' ', '_')} >
                {nistData.parent_control}
              </Link>
            </Tag>
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.supplemental_guidance && nistData.supplemental_guidance.related) {
        related = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Related NIST Controls</h3>
            <br></br>
            {nistData.supplemental_guidance.related.map((related) => (
              <Tag type="blue" key={related.toLowerCase().replace(' ', '-')}>
                <Link to={"/nists/" + related.toLowerCase().replace(' ', '_')} >
                  {related}
                </Link>
              </Tag>
            ))}
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.baseline_impact) {
        baseline_impact = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >Baseline Impact</h3>
            <br></br>
            {nistData.baseline_impact.map((baselineImpact) => (
              <Tag type="cyan" key={baselineImpact}>{baselineImpact}</Tag>
            ))}
            <br></br>
          </Column>
        </Row>;
      }
      if (nistData.references && nistData.references.reference) {
        references = <Row>
          <Column lg={{span: 12}}>
            <br></br>
            <h3 >References</h3>
            <br></br>
            <UnorderedList>
              {nistData.references.reference.map((ref) => (
                <ListItem key={ref.item["#text"]}>
                  <a href={ref.item["@href"]} target="_blank" rel="noopener noreferrer">
                    {ref.item["#text"]}
                    <Launch16 style={{ marginLeft: "5px" }} />
                  </a>
                </ListItem>
              ))}
            </UnorderedList>
            <br></br>
          </Column>
        </Row>;
      }
    }
    return (
      this.state.error ?
        <NotFound />
        :
        <Grid>
          {breadcrumb}
          {title}
          {family}
          {priority}
          {supplemental_guidance}
          {parent_control}
          {related}
          {baseline_impact}
          {references}
        </Grid >
    );
  }
}
export default NistDetailsView;