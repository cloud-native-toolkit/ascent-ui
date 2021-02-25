import React, { Component } from "react";
import BillofMaterialsView from "../../ui-patterns/bom/BillofMaterials";
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi } from '../../services';
class BillofMaterialsComponent extends Component<any, any> {
    billofMaterialsApi: BillofMaterialsApi;
    constructor(props: any) {
        super(props);
        this.billofMaterialsApi = this.bomService()
    }
    bomService(): BillofMaterialsApi {
        return Container.get(BillofMaterialsApi);
    }
    render() {
        return (
            <BillofMaterialsView bomService={this.billofMaterialsApi} archId={this.props.data} />

        );
    }
}
export default BillofMaterialsComponent;