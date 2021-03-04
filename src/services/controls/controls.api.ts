import { ControlsDataModel } from "../../models/controls/ControlsDataModel";

export abstract class ControlsDataApi {
    abstract async getControls(): Promise<ControlsDataModel[]>;
    abstract async getControlsDetails(controlId: string): Promise<ControlsDataModel>;
    abstract async doDeleteControls(controlId: string): Promise<ControlsDataModel>;
}


