import React, { Component } from "react";
import MappingView from "../../ui-patterns/mapping/MappingView";

import { MappingDataApi, ControlsDataApi, ServiceDataApi, ArchitectureDataApi } from '../../services';

import { Container } from "typescript-ioc";

class MappingComponent extends Component<any, any> {

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
            <MappingView mapping={this.mappingDataAPI} controls={this.controlsDataAPI} services={this.servicesDataAPI} arch={this.archDataAPI} />
        );
    }
}

export default MappingComponent;