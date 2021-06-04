export interface ControlsDataModel {
    id: string,
    name: string,
    controlDetails: {
        id: string,
        description: string,
        fs_guidance: string,
        implementation: string,
        parameters: string
    },
    existing_scc_goals?: string,
    human_or_automated?: string,
    frequency?: string,
    org_defined_parameter?: string,
    create_document?: string,
    base_control: boolean,
    parent_control: string,
    nist: object;
    services: object[];
    architectures: object[];
}