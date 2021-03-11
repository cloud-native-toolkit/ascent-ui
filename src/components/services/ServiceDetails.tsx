import React, { Component } from "react";
import ServiceDetailsView from "../../ui-patterns/services/ServiceDetailsView";

import { ServiceDataApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceDetailsComponent extends Component<any, any> {

    serviceDataAPI: ServiceDataApi;
    constructor(props: any) {
        super(props);
        this.serviceDataAPI = this.doGetService();
    }
    doGetService(): ServiceDataApi {
        return Container.get(ServiceDataApi);
    }

    render() {
        return (
            <div className="pattern-container">
                <ServiceDetailsView service={this.serviceDataAPI} serviceId={this.props.data} />
            </div>
        );
    }
}

export default ServiceDetailsComponent;