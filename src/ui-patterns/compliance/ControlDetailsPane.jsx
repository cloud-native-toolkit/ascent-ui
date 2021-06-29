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

import ReactMarkdown from 'react-markdown';

import SlidingPane from "react-sliding-pane";

class ControlDetailsPane extends Component {

    render () {
        const data = this.props.data;
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
                        <div className="control-details">
                            <h2>{data?.id}</h2>
                            <h3>Description</h3>
                            <br />
                            <ReactMarkdown>{data?.controlDetails?.description}</ReactMarkdown>
                            {data.parent_control && <>
                            <br />
                            <p>Parent control: <Tag type="blue">
                                <Link to={"/controls/" + data.parent_control.toLowerCase().replace(' ', '_')} >
                                    {data.parent_control}
                                </Link>
                                </Tag></p>
                            </>}
                            <br />
                            {data?.controlDetails?.fs_guidance.replace(/[ \n]/gi, '') && <>
                            <h3>Additional FS Cloud Guidance</h3>
                            <br />
                            <ReactMarkdown>{data?.controlDetails?.fs_guidance}</ReactMarkdown>
                            <br />
                            </>}
                            <br />
                            {data?.controlDetails?.parameters.replace(/[ \n]/gi, '') && <>
                            <h3>Parameters</h3>
                            <br />
                            <ReactMarkdown>{data?.controlDetails?.parameters}</ReactMarkdown>
                            <br />
                            </>}
                            <h3>Solution and Implementation</h3>
                            <br />
                            <ReactMarkdown>{data?.controlDetails?.implementation}</ReactMarkdown>
                            <br />
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
export default ControlDetailsPane;