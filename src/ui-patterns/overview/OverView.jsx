import React, { Component } from "react";


class OverView extends Component {

    render() {
        return (
            <div className="bx--grid">
                <div className="bx--row">

                    <section >
                        <h2
                            style={{
                                fontWeight: "800",
                                margin: "30px 0",
                                fontSize: "20px"
                            }}
                        >
                            IBM Cloud Architectures
                        </h2>

                        <p style={{ lineHeight: "20px" }}>

                            ASCENT's goal is to simplify the complexity of the data attributes that surround a
                            reference architecture for the IBM Cloud and the IBM Cloud for Financial Services.
                            When we review the regulatory controls the number of cloud services and the possible reference
                            architectures these can be assembled in. It has become clear a tool will help manage this wide range of attributes.
                        </p>
                        <h2
                            style={{
                                fontWeight: "800",
                                margin: "30px 0",
                                fontSize: "20px"
                            }}
                        >
                            Overview
                        </h2>
                        <p style={{ lineHeight: "20px" }}>
                            This application backend enables a collection of APIs that will support the relationship between a
                            Reference Architecture and its Bill of Materials (BOM, list of comprising services). The BOM relationship to
                            the list of cloud services. The mapping between the cloud services and the regulatory controls. Finally you can
                            view the controls mapping to the cloud Services and the supporting reference architectures.
                            <p/>
                            Once we have this data model in place, we link it to the Automation Catalog that is being
                            built by Asset team, we take the BOM and input it into the Solution Builder API they have built
                            and output a package of consistent terraform that we can use to automate the provisionning of compliant reference architectures.
                            <br /> <br />

                            <img src="/images/data-model.png" alt="Ascent data model"></img>
                            <br /> <br />

                        </p>

                    </section>
                </div>
            </div>
        );
    }
}
export default OverView;
