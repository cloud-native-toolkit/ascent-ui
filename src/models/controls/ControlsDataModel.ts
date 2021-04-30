export interface ControlsDataModel {
    id: string,
    name: string,
    description: string,
    fs_guidance: string,
    implementation: string,
    parameters: string,
    base_control: boolean,
    parent_control: string,
    nist: object;
    services: object[];
    architectures: object[];
}