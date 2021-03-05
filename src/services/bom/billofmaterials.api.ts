import { BillofMaterialsDataModel } from "../../models/bom/BillofMaterialsDataModel";
import { ServiceDataModel } from "../../models/services/serviceDataModel";
export abstract class BillofMaterialsApi {

    abstract async getBOM(archiId: string): Promise<BillofMaterialsDataModel[]>;
    abstract async doPostBOM(archiId: string, bom_details: any): Promise<BillofMaterialsDataModel[]>;
    abstract async doUpdateBOM(archiId: string, bom_details: any): Promise<BillofMaterialsDataModel[]>;
    abstract async doDeleteBOM(archiId: string): Promise<BillofMaterialsDataModel[]>;
    abstract async getServices(): Promise<ServiceDataModel[]>;
}


