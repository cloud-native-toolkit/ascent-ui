import React, { Component } from 'react';
import {
  Breadcrumb, BreadcrumbItem, Button, Grid, Row, Column, UnorderedList, ListItem
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

import ReactGA from 'react-ga4';
import ascentImg from '../../images/ascent.jpeg'

class LandingPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      hideBanner: false
    };
  }

  componentDidMount() {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user !== prevState.user) {
      return ({ user: nextProps.user });
    }
    return null
  }

  render() {
    return (
      <div>
        <form
          className="genesis--MarketingBanner-marketingBannerOverview"
          id="marketingBanner" name="marketingBanner"
          style={{ display: this.state.hideBanner ? 'none' : 'flex' }}>
          <span className="genesis--MarketingBanner-content">
            Did you know <a href='https://www.ibm.com/training/cloud/jobroles' target="_blank" rel="noopener noreferrer">IBM Cloud Training</a> is now free?
          </span>
          <Close32 onClick={() => { console.log(this.state); this.setState({ hideBanner: true }) }} />
        </form>
        <Grid fullWidth>
          <Row className='landing-page__banner'>
            <Column lg={{ span: 12 }}>
              <Breadcrumb noTrailingSlash aria-label="Page navigation">
                <BreadcrumbItem>
                  <Link to="/docs" >Documentation</Link>
                </BreadcrumbItem>
              </Breadcrumb>
              <h1 className="landing-page__heading">
               TechZone Accelerator Toolkit
              </h1>
              <h2 className="landing-page__subheading">
                Create composite multi-cloud solutions rapidly with automation that deploys IBM Software
              </h2>

            </Column>
          </Row>
          <Row className="landing-page__r2">
            <Column lg={{ span: 12 }}>

              <Grid fullWidth>
                <Row className="landing-page__tab-content">
                  <Column lg={{ span: 6 }} sm={{ span: 12 }}>

                    <h2 className="landing-page__subheading">
                      What can you do with Accelerator Toolkit automation ?
                    </h2>
                    <p className="landing-page__p">
                      The  automation  provides a simple experience for the creation of common architecture patterns for software and cloud infrastructures to enable
                      rapid composite solution creation using common automation techniques
                    </p>
                    <UnorderedList nested>
                      <ListItem>
                        Enables the fast creation of solution automation ready for production state environments
                      </ListItem>
                      <ListItem>
                        Provides a set of cloud infrastructure reference architectures for AWS, Azure and IBM Cloud including Quick Start, Standard and Advanced patterns
                      </ListItem>
                      <ListItem>
                        Provides a set of composite IBM Software architectures for common client and partner use-cases
                      </ListItem>

                    </UnorderedList>

                    <h2 className="landing-page__subheading">
                      Why do we need automation ?
                    </h2>
                    <p className="landing-page__p">
                      To help speed up the delivery and adoption of IBM Technology on multiple cloud environment including AWS, Azure and IBM Cloud.
                      Support the co-creation of composite solutions with Clients and IBM Partners. Provide consistent automation across clouds infrastructures
                      and software architectures.
                    </p>

                    {this.state.user ? <Link to="/solutions/user" ><Button>Create a Solution</Button></Link> : <Button href="/login" renderIcon={Login20}>Login</Button>}


                  </Column>
                  <Column lg={{ span: 6 }} sm={{ span: 12 }}>

                    <img
                      className="landing-page__illo"
                      src={ascentImg}
                      alt="Tool illustration"
                    />
                  </Column>
                </Row>
                <Row className="landing-page__tab-content">

                  <InfoSection heading="The Principles" className="landing-page__r3">

                    <InfoCard
                      heading="Reference Architectures"
                      body="Build your solutions using our pre-defined reference architectures for AWS, Azure or IBM Cloud. Learn more about how your architecture meets your regulatory compliance and risk management obligations."
                      icon={this.state.user ? <Link to="/boms/software" ><ModelBuilder32 /></Link> : <ModelBuilder32 />}
                    />

                    <InfoCard
                      heading="Cloud Infrastructures and Software"
                      body="Consume the Software Everywhere  module catalog, assemble them into your own custom reference architectures and deploy them in minutes using the infrascture as code bundles built by the solution builder!"
                      icon={this.state.user ? <Link to="/services" ><Cloud32 /></Link> : <Cloud32 />}
                    />

                    <InfoCard
                      heading="Security Controls"
                      body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
                      icon={this.state.user ? <Link to={this.state.user?.roles?.includes("fs-viewer") ? "/controls" : "/nists"} ><SankeyDiagramAlt32 /></Link> : <SankeyDiagramAlt32 />}
                    />
                  </InfoSection>




                </Row>
              </Grid>
            </Column>
          </Row>
        </Grid>
      </div>
    );
  }
};

export default LandingPage;
