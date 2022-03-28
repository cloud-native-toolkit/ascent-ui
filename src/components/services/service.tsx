import React, { Component } from "react";
import { Container } from "typescript-ioc";

import ServiceDataView from "../../ui-patterns/services/ServiceDataView";
import { ServiceDataApi, AutomationApi } from '../../services';
import { User } from "../../models/user";

interface ServiceComponentProps {
    ibm?: boolean,
    user: User,
}

class ServiceComponent extends Component<ServiceComponentProps, any> {

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
            <ServiceDataView service={this.serviceDataAPI} automationService={this.automationApi} ibm={this.props.ibm} user={this.props.user} />
        );
    }
}

export default ServiceComponent;
