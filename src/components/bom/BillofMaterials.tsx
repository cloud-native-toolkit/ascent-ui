import React, { Component } from "react";
import BillofMaterialsView from "../../ui-patterns/bom/BillofMaterials";
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi } from '../../services';
import { ArchitectureDataApi} from "../../services";

class BillofMaterialsComponent extends Component<any, any> {
    billofMaterialsApi: BillofMaterialsApi;
    architectureDataApi: ArchitectureDataApi;
    constructor(props: any) {
        super(props);
        this.billofMaterialsApi = this.bomService()
        this.architectureDataApi = this.archService()
    }
    bomService(): BillofMaterialsApi {
        return Container.get(BillofMaterialsApi);
    }
    archService(): ArchitectureDataApi {
        return Container.get(ArchitectureDataApi);
    }
    render() {
        return (

            <div className="pattern-container">
                <BillofMaterialsView archService={this.architectureDataApi} bomService={this.billofMaterialsApi} archId={this.props.data} />
            </div>

        );
    }
}
export default BillofMaterialsComponent;
