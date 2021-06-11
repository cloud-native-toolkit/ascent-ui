import React, { Component } from "react";
import {
    UnorderedList, ListItem, BreadcrumbSkeleton, SearchSkeleton, Tag, 
    CodeSnippet
} from 'carbon-components-react';
import {
    WarningAlt16,
    Launch16
} from '@carbon/icons-react';
import {
    Link
} from "react-router-dom";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

class ServiceDetailsPane extends Component {

    render () {
        return (
            <SlidingPane
                className="sliding-pane"
                isOpen={this.props.open}
                width="600px"
                onRequestClose={this.props.onRequestClose}
                hideHeader
            >
                {
                    this.props.data ?
                        <div>
                            <h3 style={{ display: 'flex' }}>
                                {
                                    this.props.data.catalog && this.props.data.catalog.overview_ui && this.props.data.catalog.overview_ui.en ?
                                        this.props.data.catalog.overview_ui.en.display_name
                                    : this.props.data.service ?
                                        this.props.data.service.ibm_catalog_service || this.state.dataDetails.service.service_id
                                    :
                                        this.props.data.ibm_service || this.props.data.service_id
                                }
                                {
                                    this.props.data?.fs_validated || this.props.data?.catalog?.tags?.includes("fs_ready")
                                    ? <Tag type="green" style={{ marginLeft: "auto" }}>FS Validated</Tag>
                                    : this.props.data?.service?.deployment_method === "Operator"
                                    && <Tag style={{"background-color": "#F5606D", marginLeft: "auto"}}> OpenShift Software </Tag>
                                }
                            </h3>
                            <br />
                            <p>
                                <strong>Description: </strong>
                                {
                                    this.props.data.catalog && this.props.data.catalog.overview_ui && this.props.data.catalog.overview_ui.en ?
                                        this.props.data.catalog.overview_ui.en.long_description || this.props.data.catalog.overview_ui.en.description
                                    : this.props.data.service ?
                                        this.props.data.service.desc
                                    :
                                        this.props.data.desc
                                }
                            </p>
                            <br />
                            {this.props.data.catalog && this.props.data.catalog.provider &&
                                <>
                                    <div >
                                        <p>
                                            <strong>Provider: </strong>
                                            <Tag type="blue">{this.props.data.catalog.provider.name}</Tag>
                                        </p>
                                    </div>
                                    <br />
                                </>
                            }
                            {this.props.data.service &&
                                <>
                                    {this.props.data.service.grouping ? <div><p><strong>Group: </strong> <Tag type="blue">{this.props.data.service.grouping}</Tag></p><br /></div> : <></>}
                                    {this.props.data.service.deployment_method ? <div><p><strong>Deployment Method: </strong> <Tag type="blue">{this.props.data.service.deployment_method}</Tag></p><br /></div> : <></>}
                                    {this.props.data.service.provision ? <div><p><strong>Provision: </strong> <Tag type="blue">{this.props.data.service.provision}</Tag></p><br /></div> : <></>}
                                    <div>
                                            <p>
                                                <strong>Automation id: </strong>
                                                {
                                                    this.props.data.service.cloud_automation_id && this.props.data.automation ? 
                                                        <Tag type="blue">
                                                            <a href={"https://" + this.props.data.automation.id} target="_blank">
                                                                {this.props.data.automation.name}
                                                                <Launch16 style={{"margin-left": "3px"}}/>
                                                            </a>
                                                        </Tag>
                                                    : this.props.data.service.cloud_automation_id ? 
                                                        <Tag type="blue">
                                                            {this.props.data.service.cloud_automation_id}
                                                        </Tag>
                                                    :
                                                        <Tag type="red">
                                                            <WarningAlt16 style={{'margin-right': '3px'}} /> No Automation ID
                                                        </Tag>
                                                }
                                            </p>
                                        <br />
                                    </div>
                                </>
                            }
                            {this.props.data && this.props.data.automation_variables &&
                                <>
                                    <div>
                                        <p>
                                            <strong>Automation Variables: </strong>
                                            <CodeSnippet type="multi" hideCopyButton>
                                                {this.props.data.automation_variables}
                                            </CodeSnippet>
                                        </p>
                                        <br />
                                    </div>
                                </>
                            }
                            {this.props.data.catalog && this.props.data.catalog.geo_tags && this.props.data.catalog.geo_tags.length > 0 &&
                                <>
                                    <div>
                                        <p>
                                            <strong>Geos: </strong>
                                            {this.props.data.catalog.geo_tags.map((geo) => (
                                                <Tag type="blue">{geo}</Tag>
                                            ))}
                                        </p>
                                        <br />
                                    </div>
                                </>
                            }
                            {this.props.data.service && this.props.data.service.controls && this.props.data.service.controls.length > 0 &&
                                <>
                                    <div>
                                        <p>
                                            <strong>Impacting controls: </strong>
                                            {this.props.data.service.controls.map((control) => (
                                                <Tag type="blue">
                                                    <Link to={"/controls/" + control.id.toLowerCase().replace(' ', '_')} >
                                                        {control.id}
                                                    </Link>
                                                </Tag>
                                            ))}
                                        </p>
                                        <br />
                                    </div>
                                </>
                            }
                            {this.props.data.catalog && this.props.data.catalog.metadata && this.props.data.catalog.metadata.ui && this.props.data.catalog.metadata.ui.urls &&
                                <>
                                    <div>
                                        <p>
                                            <strong>Links: </strong>
                                            <UnorderedList nested>
                                                {this.props.data.catalog.metadata.ui.urls.catalog_details_url && 
                                                    <ListItem href={this.props.data.catalog.metadata.ui.urls.catalog_details_url}>
                                                        <a href={this.props.data.catalog.metadata.ui.urls.catalog_details_url} target="_blank">
                                                            Catalog
                                                            <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                        </a>
                                                    </ListItem>
                                                }
                                                {this.props.data.catalog.metadata.ui.urls.apidocs_url && 
                                                    <ListItem href={this.props.data.catalog.metadata.ui.urls.apidocs_url}>
                                                        <a href={this.props.data.catalog.metadata.ui.urls.apidocs_url} target="_blank">
                                                            API Docs
                                                            <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                        </a>
                                                    </ListItem>
                                                }
                                                {this.props.data.catalog.metadata.ui.urls.doc_url && 
                                                    <ListItem href={this.props.data.catalog.metadata.ui.urls.doc_url}>
                                                        <a href={this.props.data.catalog.metadata.ui.urls.doc_url} target="_blank">
                                                            Documentation
                                                            <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                        </a>
                                                    </ListItem>
                                                }
                                                {this.props.data.catalog.metadata.ui.urls.instructions_url && 
                                                    <ListItem >
                                                        <a href={this.props.data.catalog.metadata.ui.urls.instructions_url} target="_blank">
                                                            Instructions
                                                            <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                        </a>
                                                    </ListItem>
                                                }
                                                {this.props.data.catalog.metadata.ui.urls.terms_url && 
                                                    <ListItem href={this.props.data.catalog.metadata.ui.urls.terms_url}>
                                                        <a href={this.props.data.catalog.metadata.ui.urls.terms_url} target="_blank">
                                                            Terms
                                                            <Launch16 style={{"margin-left": "3px", "padding-top": "1px"}}/>
                                                        </a>
                                                    </ListItem>
                                                }
                                            </UnorderedList>
                                        </p>
                                    </div>
                                </>
                            }
                        </div>
                    :
                        <div>
                            <BreadcrumbSkeleton />
                            <SearchSkeleton />
                        </div>
                }
            </SlidingPane>
        )
    }
}
export default ServiceDetailsPane;