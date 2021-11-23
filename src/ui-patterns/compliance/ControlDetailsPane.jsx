import React, { Component } from "react";
import {
    BreadcrumbSkeleton, SearchSkeleton, Button
} from 'carbon-components-react';
import {
    CheckmarkOutline32 as CheckmarkOutline,
    Close32 as Close
} from '@carbon/icons-react';

import SlidingPane from "react-sliding-pane";
import ControlDetails from './ControlDetails';

class ControlDetailsPane extends Component {

    render () {
        const data = this.props.data;
        return (
            <SlidingPane
                className="sliding-pane"
                isOpen={this.props.open}
                width="600px"
                onRequestClose={this.props.onRequestClose}
                closeIcon={<Close style={{width: '32px'}}/>}
                // hideHeader
            >
                {
                    this.props.data ?
                        <div className="control-details">
                            <h2 style={{ display: 'flex' }} >
                                {data?.id}
                                {this.props.handleButtonClick && <Button onClick={this.props.handleButtonClick} renderIcon={CheckmarkOutline} iconDescription="Add" style={{marginLeft: 'auto'}}>{this.props.buttonTitle || 'Submit'}</Button>}
                            </h2>
                            
                            {this.props.data.id && <ControlDetails data={this.props.data} />}
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