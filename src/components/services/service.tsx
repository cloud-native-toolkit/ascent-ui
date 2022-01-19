import React, { Component } from "react";
import ServiceDataView from "../../ui-patterns/services/ServiceDataView";

import { ServiceDataApi, AutomationApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceComponent extends Component<any, any> {

    serviceDataAPI: ServiceDataApi;
    automationApi: AutomationApi;
    
    constructor(props: any) {
        super(props);
        this.serviceDataAPI = this.doGetService()
        this.automationApi = this.automationService()
    }
    doGetService(): ServiceDataApi {
        return Container.get(ServiceDataApi);
    }
    automationService(): AutomationApi {
        return Container.get(AutomationApi);
    }

    render() {
        return (
            <ServiceDataView service={this.serviceDataAPI} automationService={this.automationApi} />
        );
    }
}

export default ServiceComponent;
