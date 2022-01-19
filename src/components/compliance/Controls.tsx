import React, { Component } from "react";
import ControlsView from "../../ui-patterns/compliance/ControlsView";

import { ControlsDataApi } from '../../services';

import { Container } from "typescript-ioc";

class ControlsComponent extends Component<any, any> {

    controlsDataAPI: ControlsDataApi;
    constructor(props: any) {
        super(props);
        this.controlsDataAPI = this.doGetControls()
    }
    doGetControls(): ControlsDataApi {
        return Container.get(ControlsDataApi);
    }

    render() {
        return (
            <ControlsView controls={this.controlsDataAPI} />
        );
    }
}

export default ControlsComponent;