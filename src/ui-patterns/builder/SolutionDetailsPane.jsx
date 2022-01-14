import React, { Component } from "react";
import {
    BreadcrumbSkeleton, SearchSkeleton,
    Button
} from 'carbon-components-react';
import {
    Link
} from "react-router-dom";

import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

class SolutionDetailsPane extends Component {

    render () {
        return (
            <SlidingPane
                className="sliding-pane"
                isOpen={this.props.open}
                width="600px"
                onRequestClose={this.props.onRequestClose}
            >
                {
                    this.props.data ?
                        <div>
                            <h3 style={{ display: 'flex' }}>
                                {this.props.data.name}
                                {this.props.buttonClick && this.props.user?.role === "admin" && <Button style={{marginLeft: 'auto'}} size='sm' renderIcon={this.props.buttonIcon} onClick={this.props.buttonClick}>{this.props.buttonText || 'Submit'}</Button>}
                            </h3>
                            <h4 style={{ display: 'flex', color: 'gray' }}>
                                {this.props.data.id}
                            </h4>
                            <br />
                            <p>
                                <strong>Description: </strong>
                                {
                                    this.props.data.long_desc
                                }
                            </p>
                            <br />
                            {this.props.data?.architectures?.length && <p>
                                <strong>Architecures: </strong>
                                <ul style={{listStyle:'inside'}}>
                                    {
                                        this.props.data?.architectures?.map((arch) => (
                                            <li>
                                                <Link to={`/boms/${arch.arch_id}`}>
                                                    {arch.name}
                                                </Link>
                                            </li>
                                        ))
                                    }
                                </ul>
                                
                            </p>}
                            {this.props.data?.files?.length && <p>
                                <strong>Files: </strong>
                                <ul style={{listStyle:'inside'}}>
                                    {
                                    this.props.data?.files?.map((file) => (
                                        <li>
                                            {file.Key} ({`${(file.Size/1024).toFixed(2)} Kio`})
                                        </li>
                                    ))
                                }
                                </ul>
                                
                            </p>}
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
export default SolutionDetailsPane;