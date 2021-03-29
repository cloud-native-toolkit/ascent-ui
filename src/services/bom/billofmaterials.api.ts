import { BillofMaterialsDataModel } from "../../models/bom/BillofMaterialsDataModel";
import { ServiceDataModel } from "../../models/services/serviceDataModel";
export abstract class BillofMaterialsApi {

    abstract async getBOM(archiId: string, filter:any): Promise<BillofMaterialsDataModel[]>;
    abstract async getBomComposite(archiId: string): Promise<BillofMaterialsDataModel[]>;
    abstract async getBomDetails(bomId: string): Promise<BillofMaterialsDataModel>;
    abstract async doPostBOM(archiId: string, bom_details: any): Promise<BillofMaterialsDataModel[]>;
    abstract async doUpdateBOM(bomId: string, bomDetails: any): Promise<any>;
    abstract async doDeleteBOM(bomId: string): Promise<any>;
    abstract async getServices(): Promise<ServiceDataModel[]>;
}
