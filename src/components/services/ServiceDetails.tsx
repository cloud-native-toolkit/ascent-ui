import React, { Component } from "react";
import ServiceDetailsView from "../../ui-patterns/services/ServiceDetailsView";

import { ServiceDataApi, ControlsDataApi, MappingDataApi, ArchitectureDataApi } from '../../services';

import { Container } from "typescript-ioc";
class ServiceDetailsComponent extends Component<any, any> {

    mappingDataAPI: MappingDataApi;
    controlsDataAPI: ControlsDataApi;
    servicesDataAPI: ServiceDataApi;
    archDataAPI: ArchitectureDataApi;
    constructor(props: any) {
        super(props);
        this.mappingDataAPI = this.getMappingService();
        this.controlsDataAPI = this.getControlsService();
        this.servicesDataAPI = this.getServicesService();
        this.archDataAPI = this.getArchService();
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

    render() {
        return (
            <div className="pattern-container">
                <ServiceDetailsView mapping={this.mappingDataAPI} arch={this.archDataAPI} service={this.servicesDataAPI} controls={this.controlsDataAPI} serviceId={this.props.data} />
            </div>
        );
    }
}

export default ServiceDetailsComponent;