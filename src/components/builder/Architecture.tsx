import React, { Component } from "react";
import ArchitectureView from "../../ui-patterns/builder/ArchitectureView";

import { ArchitectureDataApi } from '../../services';

import {Container} from "typescript-ioc";
class ArchitectureComponent extends Component<any, any> {

    architectureDataAPI: ArchitectureDataApi;
    constructor(props: any) {
        super(props);
        this.architectureDataAPI = this.archService()
    }
    archService(): ArchitectureDataApi {
        return Container.get(ArchitectureDataApi);
    }

    render() {
        return (
            <ArchitectureView archService={this.architectureDataAPI} />
        );
    }
}

export default ArchitectureComponent;
