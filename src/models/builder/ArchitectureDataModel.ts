export interface ArchitectureDataModel {
    arch_id: string;
    name: string;
    platform: string;
    short_desc: string;
    long_desc: string;
    public: boolean;
    production_ready: boolean;
    automation_variables: string;
    boms: object[],
    owners: object[]
}
