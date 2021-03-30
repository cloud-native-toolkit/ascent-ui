import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
} from 'carbon-components-react';
import { InfoSection, InfoCard } from '../../components/Info';

import ModelBuilder32 from '@carbon/icons-react/lib/model-builder/32';
import SankeyDiagramAlt32 from '@carbon/icons-react/lib/sankey-diagram/32';
import Cloud32 from "@carbon/icons-react/lib/cloud/32";
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

const LandingPage = () => {
  return (
    <div className="bx--grid bx--grid--full-width landing-page">
      <div className="bx--row landing-page__banner">
        <div className="bx--col-lg-16">
          <Breadcrumb noTrailingSlash aria-label="Page navigation">
            <BreadcrumbItem>
              <Link to="/docs" >Documentation</Link>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="landing-page__heading">
            Financial  Controls &amp; Reference Architectures
          </h1>
        </div>
      </div>
      <div className="bx--row landing-page__r2">
        <div className="bx--col bx--no-gutter">
          <Tabs {...props.tabs} aria-label="Tab navigation">
            <Tab {...props.tab} label="About">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-md-4 bx--col-lg-7">
                    <h2 className="landing-page__subheading">
                      What are Controls?
                    </h2>
                    <p className="landing-page__p">
                      The IBM Cloud Financial Security Controls framework will help an
                      enterprise deliver a compliance cloud architecture that produces
                      evidence that can be clearly communicated with the Governance, Risk and
                      Compliance teams. Click on the button below to learn more about how these controls align with IBM Cloud Services.
                    </p>
                    <Link to="/docs" ><Button>Learn more</Button></Link>
                    
                  </div>
                  <div className="bx--col-md-4 bx--offset-lg-1 bx--col-lg-8">
                    <img
                      className="landing-page__illo"
                      src={`${process.env.PUBLIC_URL}/tab-illo.png`}
                      alt="Tool illustration"
                    />
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Design">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    Rapidly build beautiful and accessible experiences. The
                    Carbon kit contains all resources you need to get started.
                  </div>
                </div>
              </div>
            </Tab>
            <Tab {...props.tab} label="Develop">
              <div className="bx--grid bx--grid--no-gutter bx--grid--full-width">
                <div className="bx--row landing-page__tab-content">
                  <div className="bx--col-lg-16">
                    Carbon provides styles and components in Vanilla, React,
                    Angular, and Vue for anyone building on the web.
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <InfoSection heading="The Principles" className="landing-page__r3">
        <InfoCard
          heading="Security Controls"
          body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
          icon={<Link to="/controls" ><SankeyDiagramAlt32  /></Link>}
        />
        <InfoCard
          heading="Reference Architectures"
          body="Set up your FS-ready cloud environment using our pre-defined reference architectures for the IBM Cloud for Financial Services. Learn more about how your architecture meets your regulatory compliance and risk management obligations."
          icon={<Link to="/architectures" ><ModelBuilder32  /></Link>}
        />

        <InfoCard
          heading="Cloud Services"
          body="Navigate to our IBM Cloud services and learn more about how they are impacted by our compliance controls. Add those services to your own reference architecture and automate the provisioning of your custom FS-ready cloud architecture."
          icon={<Link to="/services" ><Cloud32  /></Link>}
        />
      </InfoSection>
    </div>
  );
};

export default LandingPage;
