import React, { Component } from "react";
import NistView from "../../ui-patterns/compliance/NistView";

import { NistDataApi } from '../../services';

import { Container } from "typescript-ioc";

class NistComponent extends Component<any, any> {

    nistDataAPI: NistDataApi;
    constructor(props: any) {
        super(props);
        this.nistDataAPI = this.doGetNist()
    }
    doGetNist(): NistDataApi {
        return Container.get(NistDataApi);
    }

    render() {
        return (
            <NistView nist={this.nistDataAPI} />
        );
    }
}

export default NistComponent;