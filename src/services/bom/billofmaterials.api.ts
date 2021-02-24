import { BillofMaterialsDataModel } from "../../models/bom/BillofMaterialsDataModel";
export abstract class BillofMaterialsApi {
    abstract async doGetBOM(archiId: string): Promise<BillofMaterialsDataModel[]>;
}


