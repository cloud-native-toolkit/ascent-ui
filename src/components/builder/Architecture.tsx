import React, { Component } from "react";
import { Container } from "typescript-ioc";

import ArchitectureView from "../../ui-patterns/builder/ArchitectureView";
import { ArchitectureDataApi } from '../../services';
import { User } from "../../models/user";


class ArchitectureComponent extends Component<{
    user: User,
    isUser: boolean,
    isInfra: boolean,
    isSoftware: boolean
}, any> {

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
            <ArchitectureView
                archService={this.architectureDataAPI}
                user={this.props.user}
                isUser={this.props.isUser}
                isInfra={this.props.isInfra}
                isSoftware={this.props.isSoftware} />
        );
    }
}

export default ArchitectureComponent;
