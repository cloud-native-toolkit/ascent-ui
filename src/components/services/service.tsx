import React, { Component } from "react";
import ServiceDataView from "../../ui-patterns/services/ServiceDataView";

import { ServiceDataApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceComponent extends Component<any, any> {

    serviceDataAPI: ServiceDataApi;
    constructor(props: any) {
        super(props);
        this.serviceDataAPI = this.doGetService()
    }
    doGetService(): ServiceDataApi {
        return Container.get(ServiceDataApi);
    }

    render() {
        return (
            <div className="pattern-container">
                <ServiceDataView service={this.serviceDataAPI} />
            </div>
        );
    }
}

export default ServiceComponent;
