import React, { Component } from "react";
import NistDetailsView from "../../ui-patterns/compliance/NistDetailsView";

import { NistDataApi } from '../../services';

import { Container } from "typescript-ioc";

class NistDetailsComponent extends Component<any, any> {

    nistDataAPI: NistDataApi;
    constructor(props: any) {
        super(props);
        this.nistDataAPI = this.getNistService();
    }
    getNistService(): NistDataApi {
        return Container.get(NistDataApi);
    }

    render() {
        return (
            <div className="pattern-container">
                <NistDetailsView nist={this.nistDataAPI} number={this.props.data} />
            </div>
        );
    }
}

export default NistDetailsComponent;