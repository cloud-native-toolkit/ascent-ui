import React, { Component } from "react";
import OnBoardingView from "../../ui-patterns/compliance/OnBoardingView";

import { ControlsDataApi } from '../../services';

import { Container } from "typescript-ioc";

class OnBoardingComponent extends Component<any, any> {

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
            <OnBoardingView controls={this.controlsDataAPI} />
        );
    }
}

export default OnBoardingComponent;