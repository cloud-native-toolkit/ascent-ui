import React, { Component } from "react";
import Header from "../ui-shell/Header";



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
                            FS Cloud Architectures
                        </h2>

                        <p style={{ lineHeight: "20px" }}>

                            The Architecture builder's goal is to simplify the complexity of the data attributes that surround a
                            reference architecture for the FS Cloud. When we review the Financial Controls the number of cloud services
                            and the possible reference architectures these can be assembled in. It has become clear
                            a tool will help manage this wide range of attributes.

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


                            This application backend will enable a collection of APIs that will support the relationship between a
                            Reference Architecture and its Bill of Materials(BOM) (list of comprising services). The BOM relationship to
                            the list of FS Ready services. The mapping between the cloud services and the FS Controls. Finally you can
                            view the FS Controls mapping to the Cloud Services and the supporting refernece Architectures.
                            <p/>
                            Once we have this data model in place, we will be able to link it to the Automation Catalog that is being
                            built by Asset team,  we will be able to take the BOM and input it into the Solution Builder API they have built
                            and output a package of consistent terraform.

                            <br /> <br />

                            <img src="/images/data-model.png"></img>
                            <br /> <br />

                        </p>

                    </section>
                </div>
                <div className="bx--row">

                            <h2
                            style={{
                                fontWeight: "800",
                                margin: "30px 0",
                                fontSize: "20px"
                            }}
                        >
                            Secondary navigation
                       </h2>

                        <p style={{ lineHeight: "20px" }}>
                            The side-nav contains secondary navigation and fits below the
                            header.It can be configured to be either fixed-width or flexible,
                            ith only one level of nested items allowed.Both links and category
                            sts can be used in the side-nav and may be mixed together.There
                            several configurations of the side-nav, but only one
                            figuration should be used per product section.If tabs are needed
                            page when using a side-nav, then the tabs are secondary in
                            hierarchy to the side-nav.
                        </p>

                </div>
            </div>
        );
    }
}
export default OverView;
