import React, { Component } from "react";
import ServiceDetailsView from "../../ui-patterns/services/ServiceDetailsView";

import { ServiceDataApi, ControlsDataApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceDetailsComponent extends Component<any, any> {

    controlsDataAPI: ControlsDataApi;
    serviceDataAPI: ServiceDataApi;
    constructor(props: any) {
        super(props);
        this.controlsDataAPI = this.getControlService();
        this.serviceDataAPI = this.doGetService();
    }
    doGetService(): ServiceDataApi {
        return Container.get(ServiceDataApi);
    }
    getControlService(): ControlsDataApi {
        return Container.get(ControlsDataApi);
    }

    render() {
        return (
            <div className="pattern-container">
                <ServiceDetailsView service={this.serviceDataAPI} controls={this.controlsDataAPI} serviceId={this.props.data} />
            </div>
        );
    }
}

export default ServiceDetailsComponent;