import { ControlsDataModel } from "../../models/controls/ControlsDataModel";

export abstract class ControlsDataApi {
    abstract async getControls(): Promise<ControlsDataModel[]>;
    abstract async getControlsDetails(serviceId: string): Promise<ControlsDataModel>;
    abstract async doDeleteControls(serviceId: string): Promise<ControlsDataModel>;
}


