import React, { Component } from "react";
import { Container } from "typescript-ioc";

import ArchitectureView from "../../ui-patterns/builder/ArchitectureView";
import { ArchitectureDataApi } from '../../services';
import { User } from "../../models/user";


class ArchitectureComponent extends Component<{ user: User }, any> {

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
            <ArchitectureView archService={this.architectureDataAPI} user={this.props.user} />
        );
    }
}

export default ArchitectureComponent;
