import React, { Component }  from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  InlineNotification
} from 'carbon-components-react';
import { InfoSection, InfoCard } from '../../components/Info';

import ModelBuilder32 from '@carbon/icons-react/lib/model-builder/32';
import SankeyDiagramAlt32 from '@carbon/icons-react/lib/sankey-diagram/32';
import Cloud32 from "@carbon/icons-react/lib/cloud/32";

import {
  Login20,
} from '@carbon/icons-react';

import {
  Link
} from "react-router-dom";

const props = {
  tabs: {
    selected: 0,
    triggerHref: '#',
    role: 'navigation',
  },
  tab: {
    href: '#',
    role: 'presentation',
    tabIndex: 0,
  },
};

class LandingPage extends Component {

  constructor(props) {
      super(props);

      this.state = {
          user: undefined
      };
  }

  async componentDidMount() {
      fetch('/userDetails')
      .then(res => res.json())
      .then(user => {
        if (user.name) {
          this.setState({ user: user });
        }
      })
  }

  render() {
    return (
      <div className="bx--grid bx--grid--full-width landing-page">
        <div className="bx--row landing-page__banner">
          <div className="bx--col-lg-12">
            <Breadcrumb noTrailingSlash aria-label="Page navigation">
              <BreadcrumbItem>
                <Link to="/docs" >Documentation</Link>
              </BreadcrumbItem>
            </Breadcrumb>
            <h1 className="landing-page__heading">
              Architecture and Security Controls Enterprise Tool (ASCENT)
            </h1>
            <InlineNotification
                id={Date.now()}
                lowContrast
                title={"Free Learning"}
                subtitle={<span kind='error' hideCloseButton lowContrast>Did you know <a href='https://www.ibm.com/training/cloud/jobroles' target="_blank" rel="noopener noreferrer">IBM Cloud Training</a> is now free?</span>}
                kind={"info"}
                style={{marginBottom: '-64px'}}
            />
          </div>
        </div>
        <div className="bx--row landing-page__r2">
          <div className="bx--col bx--no-gutter">
            <Tabs {...props.tabs} aria-label="Tab navigation">
              <Tab {...props.tab} label="About">
                <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                  <div className="bx--row landing-page__tab-content">
                    <div className="bx--col-md-4 bx--col-lg-6">
                      <h2 className="landing-page__subheading">
                        What is Ascent?
                      </h2>
                      <p className="landing-page__p">
                        Ascent is a tool created by the IBM Ecosystem Labs to accelerate IBM partner's adoption of IBM Software on any cloud.
                        Through automation and integration, Ascent enables enterprises to deliver compliant cloud architectures which can be
                        clearly evidenced and communicated with Governance, Risk and Compliance teams. Click on the links below to learn more
                        about how Ascent automates and integrates Reference Architectures, Security Controls and Cloud Services.
                      </p>
                      {this.state.user ? <Link to="/docs" ><Button>Learn more</Button></Link> : <Button href="/login" renderIcon={Login20}>Login</Button>}

                    </div>
                    <div className="bx--col-md-4 bx--col-lg-5">
                      <img
                        className="landing-page__illo"
                        src={`${process.env.PUBLIC_URL}/ascent.png`}
                        alt="Tool illustration"
                      />
                    </div>
                  </div>
                  <div className="bx--row landing-page__tab-content">
                    <InfoSection heading="The Principles" className="landing-page__r3">
                      <InfoCard
                        heading="Security Controls"
                        body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
                        icon={this.state.user ? <Link to={this.state.user?.roles?.includes("fs-viewer") ? "/controls" : "/nists"} ><SankeyDiagramAlt32  /></Link> : <SankeyDiagramAlt32  />}
                      />
                      <InfoCard
                        heading="Reference Architectures"
                        body="Build your solutions using our pre-defined reference architectures for IBM Cloud, AWS and Azure. Learn more about how your architecture meets your regulatory compliance and risk management obligations."
                        icon={this.state.user ? <Link to="/boms" ><ModelBuilder32  /></Link> : <ModelBuilder32  />}
                      />

                      <InfoCard
                        heading="Cloud Infrastructures and Services"
                        body="Navigate our modules catalog, assemble them into your own custom reference architectures and deploy them in minutes using the infrascture as code bundles built by our solution builder!"
                        icon={this.state.user ? <Link to="/services" ><Cloud32  /></Link> : <Cloud32  />}
                      />
                    </InfoSection>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
};

export default LandingPage;
