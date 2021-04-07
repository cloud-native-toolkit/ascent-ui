import React, { Component } from "react";
import BillofMaterialsView from "../../ui-patterns/bom/BillofMaterials";
import { Container } from 'typescript-ioc';
import { BillofMaterialsApi, ArchitectureDataApi, AutomationApi } from "../../services";

class BillofMaterialsComponent extends Component<any, any> {
    billofMaterialsApi: BillofMaterialsApi;
    architectureDataApi: ArchitectureDataApi;
    automationApi: AutomationApi;
    
    constructor(props: any) {
        super(props);
        this.billofMaterialsApi = this.bomService()
        this.architectureDataApi = this.archService()
        this.automationApi = this.automationService()
    }
    bomService(): BillofMaterialsApi {
        return Container.get(BillofMaterialsApi);
    }
    archService(): ArchitectureDataApi {
        return Container.get(ArchitectureDataApi);
    }
    automationService(): AutomationApi {
        return Container.get(AutomationApi);
    }
    render() {
        return (

            <div className="pattern-container">
                <BillofMaterialsView archService={this.architectureDataApi} automationService={this.automationApi} bomService={this.billofMaterialsApi} archId={this.props.data} />
            </div>

        );
    }
}
export default BillofMaterialsComponent;
