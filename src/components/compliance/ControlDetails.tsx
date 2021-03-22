import React, { Component } from "react";
import ControlDetailsView from "../../ui-patterns/compliance/ControlDetailsView";

import { ServiceDataApi, ControlsDataApi, MappingDataApi, ArchitectureDataApi } from '../../services';

import { Container } from "typescript-ioc";

class ControlDetailsComponent extends Component<any, any> {

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
                <ControlDetailsView mapping={this.mappingDataAPI} arch={this.archDataAPI} service={this.servicesDataAPI} controls={this.controlsDataAPI} controlId={this.props.data} />
            </div>
        );
    }
}

export default ControlDetailsComponent;