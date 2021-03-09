import { NistDataModel } from "../../models/nist/NistDataModel";

export abstract class NistDataApi {
    abstract async getNist(): Promise<NistDataModel[]>;
    abstract async getNistDetails(controlId: string): Promise<NistDataModel>;
}


