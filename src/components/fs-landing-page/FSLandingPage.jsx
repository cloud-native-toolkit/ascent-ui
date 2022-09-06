import React, {Component} from 'react';
import {Breadcrumb, BreadcrumbItem, Button, Column, Grid, ListItem, Row, UnorderedList} from 'carbon-components-react';

import {InfoCard, InfoSection} from './Info';

import {Close32, Cloud32, Login20, ModelBuilder32, SankeyDiagramAlt32} from '@carbon/icons-react';

import {Link} from "react-router-dom";

import ReactGA from 'react-ga4';

import controlsFramework from '../../images/controls-framework.svg'

class FSLandingPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: null,
            hideBanner: false
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.user !== prevState.user) {
            return ({user: nextProps.user});
        }
        return null
    }

    componentDidMount() {
        ReactGA.send({hitType: "pageview", page: window.location.pathname});
    }

    render() {
        return (
            <div>
                <form
                    className="genesis--MarketingBanner-marketingBannerOverview"
                    id="marketingBanner" name="marketingBanner"
                    style={{display: this.state.hideBanner ? 'none' : 'flex'}}>
          <span className="genesis--MarketingBanner-content">
            Did you know <a href='https://www.ibm.com/training/cloud/jobroles' target="_blank"
                            rel="noopener noreferrer">IBM Cloud Training</a> is now free?
          </span>
                    <Close32 onClick={() => {
                        console.log(this.state);
                        this.setState({hideBanner: true})
                    }}/>
                </form>
                <Grid fullWidth>
                    <Row className='landing-page__banner'>
                        <Column lg={{span: 6}}>
                            <Breadcrumb noTrailingSlash aria-label="Page navigation">
                                <BreadcrumbItem>
                                    <a target="_blank" href="https://cloud.ibm.com/docs/framework-financial-services">Cloud Documentation</a>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            <h1 className="landing-page__heading">
                               Controls Catalog
                            </h1>
                            <h2 className="landing-page__subheading">
                                IBM Cloud for Financial Services
                            </h2>
                        </Column>
                        <Column lg={{span: 6}} sm={{span: 12}} className='flex-right'>

                            <img
                                className="landing-page__illo"
                                src={controlsFramework}
                                alt="Tool illustration"
                            />
                        </Column>

                    </Row>
                    <Row className="landing-page__r2">
                        <Column lg={{span: 12}}>
                            <Row className="landing-page__tab-content">
                                <Column lg={{span: 12}} sm={{span: 12}}>

                                    <h2 className="landing-page__subheading">
                                        IBM Cloud Framework for Financial Services
                                    </h2>
                                    <p className="landing-page__p">
                                        IBM Cloud Framework for Financial Services™ is designed to help address the needs of financial services institutions with regulatory compliance, security, and resiliency during the initial deployment phase and with ongoing operations. The framework also helps to simplify the ability of financial institutions to transact with ecosystem partners who deliver software or SaaS applications, and who meet the requirements of the framework.
                                    </p>
                                    <UnorderedList nested>
                                        <ListItem>
                                            A comprehensive set of control requirements designed to help address the security requirements and regulatory compliance obligations of financial institutions and cloud best practices. The cloud best practices include a shared responsibility model across financial institutions, application providers, and IBM Cloud.
                                        </ListItem>
                                        <ListItem>
                                            Detailed control-by-control guidance for implementation and supporting evidence to help address the security and regulatory requirements of the financial industry.
                                        </ListItem>
                                        <ListItem>
                                            Reference architectures designed to facilitate compliance with the control requirements. In addition, resources are provided to deploy infrastructure as code in order to automate deployment and configuration of the reference architectures.
                                        </ListItem>
                                        <ListItem>
                                            Tools and IBM services, such as IBM Cloud® Security and Compliance Center, to enable parties to efficiently and effectively monitor compliance, remediate issues, and generate evidence of compliance.
                                        </ListItem>

                                    </UnorderedList>

                                    <h2 className="landing-page__subheading">
                                        Control Requirements
                                    </h2>
                                    <p className="landing-page__p">
                                        The technology-agnostic control requirements defined in the framework were built by the industry for the industry. The framework contains 565 control requirements that span 7 focus areas and 21 control families. The control requirements were initially based on NIST 800-53 Rev 4 and have been enhanced based on feedback from leading industry partners.
                                    </p>

                                    {this.state.user ?
                                        <Link to="/controls"><Button>View the Controls</Button></Link> :
                                        <Button href="/login" renderIcon={Login20}>Login</Button>}

                                </Column>
                            </Row>
                            <Row className="landing-page__tab-content">
                                <Column lg={{ span: 12 }}>
                                    <InfoSection heading="The Principles" className="landing-page__r3">

                                        <InfoCard
                                            heading="Security Controls"
                                            body="The IBM Cloud Framework for Financial Services provides a set of pre-configured compliance controls that are adhered to by the entire ecosystem — financial institutions, cloud services, and the digital supply chain of ISVs and SaaS providers."
                                            icon={this.state.user ?
                                                <Link to="/controls"><SankeyDiagramAlt32/></Link>
                                                :
                                                <SankeyDiagramAlt32/>}
                                        />
                                    </InfoSection>
                                </Column>
                            </Row>
                        </Column>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default FSLandingPage;
