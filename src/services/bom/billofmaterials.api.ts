import { BillofMaterialsDataModel } from "../../models/bom/BillofMaterialsDataModel";
export abstract class BillofMaterialsApi {

    abstract async getBOM(archiId: string): Promise<BillofMaterialsDataModel[]>;


}


