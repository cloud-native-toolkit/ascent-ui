import React, { Component } from "react";
import ControlDetailsView from "../../ui-patterns/compliance/ControlDetailsView";

import { ControlsDataApi } from '../../services';

import { Container } from "typescript-ioc";

class ControlDetailsComponent extends Component<any, any> {

    controlsDataAPI: ControlsDataApi;
    constructor(props: any) {
        super(props);
        this.controlsDataAPI = this.getControlService();
    }
    getControlService(): ControlsDataApi {
        return Container.get(ControlsDataApi);
    }

    render() {
        return (
            <div className="pattern-container">
                <ControlDetailsView controls={this.controlsDataAPI} controlId={this.props.data} />
            </div>
        );
    }
}

export default ControlDetailsComponent;