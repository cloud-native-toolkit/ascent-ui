import React, { Component } from "react";
import ServiceDetailsView from "../../ui-patterns/services/ServiceDetailsView";

import { ServiceDataApi, ControlsDataApi, MappingDataApi, ArchitectureDataApi, AutomationApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceDetailsComponent extends Component<any, any> {

    mappingDataAPI: MappingDataApi;
    controlsDataAPI: ControlsDataApi;
    servicesDataAPI: ServiceDataApi;
    archDataAPI: ArchitectureDataApi;
    automationApi: AutomationApi;
    constructor(props: any) {
        super(props);
        this.mappingDataAPI = this.getMappingService();
        this.controlsDataAPI = this.getControlsService();
        this.servicesDataAPI = this.getServicesService();
        this.archDataAPI = this.getArchService();
        this.automationApi = this.automationService()
    }
    getMappingService(): MappingDataApi {
        return Container.get(MappingDataApi);
    }
    getControlsService(): ControlsDataApi {
        return Container.get(ControlsDataApi);
    }
    getServicesService(): ServiceDataApi {
        return Container.get(ServiceDataApi);
    }
    getArchService(): ArchitectureDataApi {
        return Container.get(ArchitectureDataApi);
    }
    automationService(): AutomationApi {
        return Container.get(AutomationApi);
    }

    render() {
        return (
            <ServiceDetailsView 
                mapping={this.mappingDataAPI}
                arch={this.archDataAPI}
                service={this.servicesDataAPI}
                controls={this.controlsDataAPI}
                automationService={this.automationApi}
                serviceId={this.props.data}
            />
        );
    }
}

export default ServiceDetailsComponent;