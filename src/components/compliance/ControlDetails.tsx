import React, { Component } from "react";
import ControlDetailsView from "../../ui-patterns/compliance/ControlDetailsView";

import { ServiceDataApi, ControlsDataApi, MappingDataApi, ArchitectureDataApi, NistDataApi } from '../../services';

import { Container } from "typescript-ioc";

class ControlDetailsComponent extends Component<any, any> {

    mappingDataAPI: MappingDataApi;
    controlsDataAPI: ControlsDataApi;
    servicesDataAPI: ServiceDataApi;
    archDataAPI: ArchitectureDataApi;
    nistDataAPI: NistDataApi;
    constructor(props: any) {
        super(props);
        this.mappingDataAPI = this.getMappingService();
        this.controlsDataAPI = this.getControlsService();
        this.servicesDataAPI = this.getServicesService();
        this.archDataAPI = this.getArchService();
        this.nistDataAPI = this.getNistService();
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
    getNistService(): NistDataApi {
        return Container.get(NistDataApi);
    }

    render() {
        return (
            <ControlDetailsView nist={this.nistDataAPI} mapping={this.mappingDataAPI} arch={this.archDataAPI} service={this.servicesDataAPI} controls={this.controlsDataAPI} controlId={this.props.data} />
        );
    }
}

export default ControlDetailsComponent;