import React, { Component } from "react";
import {
    UnorderedList, ListItem, BreadcrumbSkeleton, SearchSkeleton, Tag, 
    CodeSnippet
} from 'carbon-components-react';
import {
    WarningAlt16,
    Launch16,
    Launch32
} from '@carbon/icons-react';
import {
    Link
} from "react-router-dom";

import SlidingPane from "react-sliding-pane";
import ServiceDetails from './ServiceDetails';

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
                            <a href={`https://${this.props.data?.service?.id}`} target="_blank">
                                <h3 style={{ display: 'flex' }}>
                                    {
                                        this.props.data?.catalog?.overview_ui?.en ?
                                            this.props.data.catalog.overview_ui.en.display_name
                                        : this.props.data?.service ?
                                            this.props.data?.service?.fullname || this.props.data?.service?.name
                                        :
                                            this.props.data?.fullname || this.props.data?.name
                                    }
                                    <Launch32 style={{marginLeft: "5px", paddingTop: "5px"}} />
                                    {
                                        this.props.data?.fs_validated || this.props.data?.catalog?.tags?.includes("fs_ready")
                                        ? <Tag type="green" style={{ marginLeft: "auto" }}>FS Validated</Tag>
                                        : ["gitops","tools","ocp"].includes(this.props.data?.service?.provider)
                                        && <Tag style={{"background-color": "#F5606D", marginLeft: "auto"}}> OpenShift Software </Tag>
                                    }
                                </h3>
                            </a>
                            <br />
                            <ServiceDetails data={this.props.data} />
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