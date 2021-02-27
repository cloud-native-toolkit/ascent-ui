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

            <div className="pattern-container">
                <BillofMaterialsView bomService={this.billofMaterialsApi} archId={this.props.data} />
            </div>

        );
    }
}
export default BillofMaterialsComponent;