import React, { Component } from "react";

import { Grid, Row, Column } from 'carbon-addons-iot-react/node_modules/carbon-components-react';

import ReactGA from 'react-ga4';


class OverView extends Component {

    componentDidMount() {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }

    render() {
        return (
            <Grid>
                <Row className="compliance-page__row">
                    <Column lg={{span: 12}}>
                        <h2 style={{ margin: "30px 0" }} >
                            Ascent - Solution Builder & Security Controls
                        </h2>

                        <p style={{ lineHeight: "20px" }}>
                            ASCENT's goal is to accelerate adoption of IBM Software on Hybrid-Cloud. Ascent drastically reduces the time and effort it takes
                            to deploy solutions leveraging IBM Software on any Cloud, by providing a modular automation framework allowing users to build their
                            custom solutions and automate their deployment using our solution builder features.
                            Ascent also simplifies the complexity of the data attributes that surround a rereference architecture for enterprise workloads with regulatory compliance.
                            When we review the regulatory controls the number of cloud services and the possible reference
                            architectures these can be assembled in, it has become clear a tool will help manage this wide range of attributes.
                        </p>
                        <h2 style={{ margin: "30px 0" }} >
                            Overview
                        </h2>
                        <p style={{ lineHeight: "20px" }}>
                            This application backend enables a collection of APIs that will support the relationship between a
                            Reference Architecture and its Bill of Materials (BOM, list of comprising services). The BOM relationship to
                            the list of cloud services. The mapping between the cloud services and the regulatory controls. Finally you can
                            view the controls mapping to the cloud Services and the supporting reference architectures.

                            <br /> <br />

                            Once we have this data model in place, we link it to the Automation Catalog that is being
                            built by Asset team, we take the BOM and input it into the Solution Builder API they have built
                            and output a package of consistent terraform that we can use to automate the provisionning of compliant reference architectures.
                            <br /> <br />

                            <img src="/images/data-model.png" alt="Ascent data model"></img>
                            <br /> <br />

                        </p>
                    </Column>
                </Row>
            </Grid>
        );
    }
}
export default OverView;
