import React, { Component }  from 'react';
import {
  Breadcrumb, BreadcrumbItem, Button, Tabs, Tab, Grid, Row, Column,UnorderedList,ListItem
} from 'carbon-components-react';

import { InfoSection, InfoCard } from './Info';

import {
  ModelBuilder32, SankeyDiagramAlt32, Cloud32, Close32
} from '@carbon/icons-react';

import {
  Login20,
} from '@carbon/icons-react';

import {
  Link
} from "react-router-dom";

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      hideBanner: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user !== prevState.user) {
      return ({ user: nextProps.user });
    }
    return null
  }

  render() {
    return (
      <Grid fullWidth className="landing-page">
        <Row className="landing-page__banner">
          <Column lg={{span: 12}}>
            <form
              class="genesis--MarketingBanner-marketingBannerOverview"
              id="marketingBanner" name="marketingBanner"
              style={{ margin: '0 -2rem', display: this.state.hideBanner ? 'none': 'flex' }}>
              <span class="genesis--MarketingBanner-content">
                Did you know <a href='https://www.ibm.com/training/cloud/jobroles' target="_blank" rel="noopener noreferrer">IBM Cloud Training</a> is now free?
              </span>
              <Close32 onClick={() => {console.log(this.state);this.setState({ hideBanner: true })}} />
            </form>
            <Breadcrumb noTrailingSlash aria-label="Page navigation">
              <BreadcrumbItem>
                <Link to="/docs" >Documentation</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="landing-page__heading">
              Software Everywhere
            </h1>
            <h2 className="landing-page__subheading">
              Architecture and Security Controls Enterprise Tool (ASCENT)
            </h2>

          </Column>
        </Row>
        <Row className="landing-page__r2">
          <Column lg={{span: 12}}>
            <Tabs aria-label="Tab navigation">
              <Tab label="About">
                <Grid>
                  <Row className="landing-page__tab-content">
                    <Column  lg={{span: 6}}  md={{span: 4}}>

                        <h2 className="landing-page__subheading">
                          What does Ascent do ?
                        </h2>
                        <p className="landing-page__p">
                         Ascent provides a simple experience for the creation of common architecture patterns for software and cloud infrastructures to enable
                          rapid composite solution creation
                        </p>
                        <div className="landing-page-list">
                          <UnorderedList>
                            <ListItem>
                              Provides a set of cloud infrastructure reference architectures for AWS, Azure and IBM Cloud including Quick Start, Standard and Advanced patterns
                            </ListItem>
                            <ListItem>
                              Provides a set of composite IBM Software architectures for common client and partner use-cases
                            </ListItem>
                            <ListItem>
                              Enables the fast creation of solutions to be consumed by DevOps and SRE teams in setting up production state environments
                            </ListItem>
                          </UnorderedList>
                        </div>

                        <h2 className="landing-page__subheading">
                          Why do we need Ascent ?
                        </h2>
                        <p className="landing-page__p">
                          To help speed up the delivery and adoption of IBM Software on multiple cloud environment including AWS, Azure and IBM Cloud.
                          Support the co creation of composite solutions with Clients and IBM Partners. Provide consistent automation across clouds infrastructures
                          and software architectures.
                        </p>

                        {this.state.user ? <Link to="/docs" ><Button>Learn more</Button></Link> : <Button href="/login" renderIcon={Login20}>Login</Button>}


                    </Column>
                    <Column lg={{span: 5}} md={{span: 4}}>
                      <img
                        className="landing-page__illo"
                        src={`${process.env.PUBLIC_URL}/ascent.png`}
                        alt="Tool illustration"
                      />
                    </Column>
                  </Row>
                  <Row className="landing-page__tab-content">

                    <InfoSection heading="The Principles" className="landing-page__r3">

                      <InfoCard
                        heading="Reference Architectures"
                        body="Build your solutions using our pre-defined reference architectures for AWS, Azure or IBM Cloud. Learn more about how your architecture meets your regulatory compliance and risk management obligations."
                        icon={this.state.user ? <Link to="/boms/software" ><ModelBuilder32  /></Link> : <ModelBuilder32  />}
                      />

                      <InfoCard
                        heading="Cloud Infrastructures and Software"
                        body="Consume the Software Everywhere  module catalog, assemble them into your own custom reference architectures and deploy them in minutes using the infrascture as code bundles built by the solution builder!"
                        icon={this.state.user ? <Link to="/services" ><Cloud32  /></Link> : <Cloud32  />}
                      />

                      <InfoCard
                          heading="Security Controls"
                          body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
                          icon={this.state.user ? <Link to={this.state.user?.roles?.includes("fs-viewer") ? "/controls" : "/nists"} ><SankeyDiagramAlt32  /></Link> : <SankeyDiagramAlt32  />}
                      />
                    </InfoSection>




                  </Row>
                </Grid>
              </Tab>
            </Tabs>
          </Column>
        </Row>
      </Grid>
    );
  }
};

export default LandingPage;
