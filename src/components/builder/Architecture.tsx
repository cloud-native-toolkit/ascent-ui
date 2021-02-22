import React, { Component } from "react";
import { Container } from 'typescript-ioc';
import ArchitectureView from "../../ui-patterns/builder/ArchitectureView";
import { ArchitectureDataApi } from '../../services';
class ArchitectureComponent extends Component<any, any> {
    formApi: ArchitectureDataApi;
    constructor(props: any) {
        super(props);
        this.formApi = this.formService();
    }
    formService(): ArchitectureDataApi {
        return Container.get(ArchitectureDataApi);
    }
    render() {
        return (
            <div className="pattern-container">
                <ArchitectureView data={this.formApi} />
            </div>
        );
    }
}
export default ArchitectureComponent;